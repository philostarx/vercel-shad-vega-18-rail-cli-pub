import { getCurrentData, getScenarioData, ScenarioType } from '../data';
import { PerformanceData, EnhancedPerformanceData, CalculatedKPI, MockScenario } from './types';
import { fetchPerformanceData } from './api';

/**
 * 하이브리드 데이터 로더 클래스 (JSON + API 지원)
 * 환경 변수로 데이터 소스 선택 가능
 * 작성자: ft.clau
 * 수정일: 2025-06-01 (Phase 3 - API 연동)
 */
class DataLoader {
  private cache: Map<string, PerformanceData[]> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5분
  private dataSource: 'json' | 'api';

  constructor() {
    // 환경 변수로 데이터 소스 결정
    this.dataSource = (process.env.NEXT_PUBLIC_DATA_SOURCE as 'json' | 'api') || 'api';
    console.log(`🔧 데이터 소스: ${this.dataSource.toUpperCase()}`);
  }

  /**
   * 현재 활성 데이터셋 로드 (동기/비동기 하이브리드)
   */
  async loadCurrentDataset(): Promise<PerformanceData[]> {
    const cacheKey = 'current-dataset';

    // 캐시 확인
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      if (this.dataSource === 'api') {
        // API 기반 데이터 로드
        console.log('📡 API에서 데이터 로드 중...');
        const response = await fetchPerformanceData({ limit: 100 });
        
        if (response.status === 'success') {
          // API 응답을 PerformanceData 형식으로 변환
          const data: PerformanceData[] = response.data.map(item => ({
            id: item.id,
            campaignName: item.campaignName,
            channel: item.channel,
            impressions: item.impressions,
            clicks: item.clicks,
            conversions: item.conversions,
            cost: item.cost,
            revenue: item.revenue,
            date: item.date
          }));

          this.cache.set(cacheKey, data);
          this.setCacheTimeout(cacheKey);
          
          console.log(`✅ API에서 ${data.length}개 레코드 로드 완료`);
          return data;
        } else {
          throw new Error('API 응답 실패');
        }
      } else {
        // JSON 기반 데이터 로드 (폴백)
        console.log('📂 JSON 파일에서 데이터 로드 중...');
        const data = getCurrentData();
        
        if (!Array.isArray(data) || data.length === 0) {
          console.warn('데이터가 비어있습니다. 폴백 데이터를 사용합니다.');
          return this.getFallbackData();
        }

        this.cache.set(cacheKey, data);
        this.setCacheTimeout(cacheKey);
        
        console.log(`✅ JSON에서 ${data.length}개 레코드 로드 완료`);
        return data;
      }
    } catch (error) {
      console.error('데이터 로딩 실패, JSON 폴백 사용:', error);
      
      // API 실패 시 JSON 폴백
      if (this.dataSource === 'api') {
        try {
          const fallbackData = getCurrentData();
          console.log('🔄 JSON 폴백 데이터 사용');
          return fallbackData;
        } catch (fallbackError) {
          console.error('JSON 폴백도 실패:', fallbackError);
        }
      }
      
      return this.getFallbackData();
    }
  }

  /**
   * 시나리오 데이터 로드 (동기적)
   */
  loadScenarioData(scenario: ScenarioType): PerformanceData[] {
    const cacheKey = `scenario-${scenario}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const data = getScenarioData(scenario);
      
      if (!Array.isArray(data) || data.length === 0) {
        return this.getFallbackData();
      }

      this.cache.set(cacheKey, data);
      this.setCacheTimeout(cacheKey);

      return data;
    } catch (error) {
      console.error(`시나리오 데이터 로딩 실패 (${scenario}):`, error);
      return this.getFallbackData();
    }
  }

  /**
   * 환경변수 기반 데이터 로드 (비동기)
   */
  async loadData(): Promise<PerformanceData[]> {
    const scenario = (process.env.MOCK_SCENARIO as MockScenario) || 'current';
    
    if (scenario === 'current') {
      return this.loadCurrentDataset();
    }
    
    return this.loadScenarioData(scenario as ScenarioType);
  }

  /**
   * KPI 계산 (기존 로직 유지)
   */
  calculateKPI(data: PerformanceData): CalculatedKPI {
    const ctr = data.impressions > 0 ? (data.clicks / data.impressions) * 100 : 0;
    const roas = data.cost > 0 ? data.revenue / data.cost : 0;
    const cpa = data.conversions > 0 ? data.cost / data.conversions : 0;
    const conversionRate = data.clicks > 0 ? (data.conversions / data.clicks) * 100 : 0;

    return {
      ctr: Math.round(ctr * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      cpa: Math.round(cpa),
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  }

  /**
   * 향상된 성과 데이터 생성 (기존 로직 유지)
   */
  enhancePerformanceData(data: PerformanceData[]): EnhancedPerformanceData[] {
    return data.map(item => ({
      ...item,
      ...this.calculateKPI(item)
    }));
  }

  /**
   * 날짜 필터링 (기존 로직 유지)
   */
  filterByDateRange(
    data: PerformanceData[],
    startDate?: string,
    endDate?: string
  ): PerformanceData[] {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');

      return itemDate >= start && itemDate <= end;
    });
  }

  /**
   * 채널 필터링 (기존 로직 유지)
   */
  filterByChannels(data: PerformanceData[], channels?: string[]): PerformanceData[] {
    if (!channels || channels.length === 0) return data;
    return data.filter(item => channels.includes(item.channel));
  }

  /**
   * 페이징 처리 (기존 로직 유지)
   */
  paginate<T>(data: T[], page: number = 1, limit: number = 50): {
    data: T[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  } {
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);

    return {
      data: paginatedData,
      meta: {
        total: data.length,
        page,
        limit,
        totalPages: Math.ceil(data.length / limit)
      }
    };
  }

  /**
   * 캐시 타임아웃 설정
   */
  private setCacheTimeout(key: string): void {
    setTimeout(() => {
      this.cache.delete(key);
    }, this.cacheTimeout);
  }

  /**
   * 폴백 데이터 (기존 로직 유지)
   */
  private getFallbackData(): PerformanceData[] {
    return [
      {
        id: 1,
        campaignName: "기본 캠페인",
        channel: "Google",
        impressions: 10000,
        clicks: 300,
        conversions: 15,
        cost: 150000,
        revenue: 450000,
        date: "2024-05-27"
      }
    ];
  }

  /**
   * 캐시 관리
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 캐시 상태 확인 (디버깅용)
   */
  getCacheStatus(): { [key: string]: number } {
    const status: { [key: string]: number } = {};
    this.cache.forEach((value, key) => {
      status[key] = value.length;
    });
    return status;
  }
}

// 싱글톤 인스턴스 (기존 방식 유지)
export const dataLoader = new DataLoader();