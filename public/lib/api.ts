import { ApiResponse, EnhancedPerformanceData, KPIAggregateData, ChannelPerformance } from './types';
import mockPerformanceData from '@/data/mockPerformanceData.json';
import mockKPIData from '@/data/mockKPIData.json';

/**
 * API 호출 함수 모음 (GitHub Pages용 정적 데이터 버전)
 * 작성자: ft.s.curs
 * 수정일: 2025-01-27 (GitHub Pages 배포용 정적 데이터 변경)
 */

/**
 * 전체 성과 데이터 조회 (정적 데이터 버전)
 */
export async function fetchPerformanceData(params?: {
  startDate?: string;
  endDate?: string;
  channel?: string[];
  page?: number;
  limit?: number;
}): Promise<ApiResponse<EnhancedPerformanceData[]>> {
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log('📊 정적 성과 데이터 로딩:', params);

  // 필터링 로직 (옵션)
  let filteredData = mockPerformanceData.data;

  // 채널 필터링
  if (params?.channel && params.channel.length > 0) {
    filteredData = filteredData.filter(item =>
      params.channel!.includes(item.channel)
    );
  }

  // 날짜 필터링 (간단한 구현)
  if (params?.startDate) {
    filteredData = filteredData.filter(item =>
      item.date >= params.startDate!
    );
  }

  if (params?.endDate) {
    filteredData = filteredData.filter(item =>
      item.date <= params.endDate!
    );
  }

  // 페이지네이션
  const page = params?.page || 1;
  const limit = params?.limit || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return {
    status: 'success',
    data: paginatedData,
    meta: {
      total: filteredData.length,
      page: page,
      limit: limit
    }
  };
}

/**
 * KPI 집계 데이터 조회 (정적 데이터 버전)
 */
export async function fetchKPIData(params?: {
  startDate?: string;
  endDate?: string;
  channel?: string[];
}): Promise<ApiResponse<KPIAggregateData>> {
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 300));

  console.log('📈 정적 KPI 데이터 로딩:', params);

  // 채널 필터링이 있는 경우 데이터 조정 (간단한 구현)
  let kpiData = { ...mockKPIData.data };

  if (params?.channel && params.channel.length > 0) {
    // 선택된 채널만 필터링
    const filteredChannels = kpiData.channelBreakdown.filter(channel =>
      params.channel!.includes(channel.channel)
    );

    // 총합 재계산
    const totals = filteredChannels.reduce((acc, channel) => ({
      impressions: acc.impressions + channel.impressions,
      clicks: acc.clicks + channel.clicks,
      conversions: acc.conversions + channel.conversions,
      cost: acc.cost + channel.cost,
      revenue: acc.revenue + channel.revenue
    }), { impressions: 0, clicks: 0, conversions: 0, cost: 0, revenue: 0 });

    kpiData = {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      totalCost: totals.cost,
      totalRevenue: totals.revenue,
      averageCTR: totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0,
      averageROAS: totals.cost > 0 ? totals.revenue / totals.cost : 0,
      averageCPA: totals.conversions > 0 ? totals.cost / totals.conversions : 0,
      averageConversionRate: totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0,
      channelBreakdown: filteredChannels,
      dailyTrends: kpiData.dailyTrends
    };
  } else {
    // 전체 데이터 사용 시 타입에 맞게 변환
    kpiData = {
      totalImpressions: kpiData.totalImpressions,
      totalClicks: kpiData.totalClicks,
      totalConversions: kpiData.totalConversions,
      totalCost: kpiData.totalCost,
      totalRevenue: kpiData.totalRevenue,
      averageCTR: kpiData.averageCTR,
      averageROAS: kpiData.averageROAS,
      averageCPA: kpiData.averageCPA,
      averageConversionRate: kpiData.averageConversionRate,
      channelBreakdown: kpiData.channelBreakdown,
      dailyTrends: kpiData.dailyTrends
    };
  }

  return {
    status: 'success',
    data: kpiData,
    meta: {
      total: 1
    }
  };
}

/**
 * 채널별 성과 데이터 조회 (정적 데이터 버전)
 */
export async function fetchChannelData(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<ApiResponse<ChannelPerformance[]>> {
  // 시뮬레이션을 위한 지연
  await new Promise(resolve => setTimeout(resolve, 400));

  console.log('🎯 정적 채널 데이터 로딩:', params);

  // KPI 데이터에서 채널 정보 추출하여 타입에 맞게 변환
  const channelData: ChannelPerformance[] = mockKPIData.data.channelBreakdown.map(channel => ({
    channel: channel.channel,
    totalCost: channel.cost,
    totalRevenue: channel.revenue,
    roas: channel.roas,
    conversions: channel.conversions,
    clicks: channel.clicks,
    impressions: channel.impressions
  }));

  return {
    status: 'success',
    data: channelData,
    meta: {
      total: channelData.length
    }
  };
}

/**
 * 에러 핸들링을 포함한 안전한 API 호출
 */
export async function safeApiCall<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  fallbackData: T
): Promise<{ data: T; error: string | null }> {
  try {
    const response = await apiFunction();

    if (response.status === 'success') {
      return { data: response.data, error: null };
    } else {
      return {
        data: fallbackData,
        error: response.meta?.message || '알 수 없는 오류가 발생했습니다.'
      };
    }
  } catch (error) {
    console.error('API 호출 오류:', error);
    return {
      data: fallbackData,
      error: '데이터 로딩 중 오류가 발생했습니다.'
    };
  }
}

/**
 * 데이터 포맷팅 유틸리티 (기본값: 영문/USD)
 */
export const formatters = {
  currency: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  },

  number: (value: number): string => {
    return new Intl.NumberFormat('en-US').format(value);
  },

  percentage: (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100);
  },

  decimal: (value: number, digits: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  },

  date: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US');
  }
};
