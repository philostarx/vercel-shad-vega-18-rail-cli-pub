'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCurrentData } from '../data';
import { EnhancedPerformanceData, KPIAggregateData, FilterParams, PerformanceData } from '../lib/types';

interface UsePerformanceDataReturn {
  data: EnhancedPerformanceData[];
  kpiData: KPIAggregateData | null;
  loading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  refetch: () => void;
  updateFilters: (filters: FilterParams) => void;
}

/**
 * 정적 데이터를 사용하는 성과 데이터 관리 커스텀 훅 (GitHub Pages용)
 */
export function usePerformanceData(initialFilters: FilterParams = {}): UsePerformanceDataReturn {
  const [data, setData] = useState<EnhancedPerformanceData[]>([]);
  const [kpiData, setKpiData] = useState<KPIAggregateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [totalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(filters.page || 1);

  /**
   * KPI 계산 함수
   */
  const calculateKPI = (item: PerformanceData) => {
    const ctr = item.impressions > 0 ? (item.clicks / item.impressions) * 100 : 0;
    const roas = item.cost > 0 ? item.revenue / item.cost : 0;
    const cpa = item.conversions > 0 ? item.cost / item.conversions : 0;
    const conversionRate = item.clicks > 0 ? (item.conversions / item.clicks) * 100 : 0;

    return {
      ctr: Math.round(ctr * 100) / 100,
      roas: Math.round(roas * 100) / 100,
      cpa: Math.round(cpa),
      conversionRate: Math.round(conversionRate * 100) / 100
    };
  };

  /**
   * 향상된 성과 데이터 생성
   */
  const enhancePerformanceData = (rawData: PerformanceData[]): EnhancedPerformanceData[] => {
    return rawData.map(item => ({
      ...item,
      ...calculateKPI(item)
    }));
  };

  /**
   * 날짜 필터링
   */
  const filterByDateRange = (
    data: PerformanceData[],
    startDate?: string,
    endDate?: string
  ): PerformanceData[] => {
    if (!startDate && !endDate) return data;

    return data.filter(item => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : new Date('1900-01-01');
      const end = endDate ? new Date(endDate) : new Date('2100-12-31');

      return itemDate >= start && itemDate <= end;
    });
  };

  /**
   * 채널 필터링
   */
  const filterByChannels = (data: PerformanceData[], channels?: string[]): PerformanceData[] => {
    if (!channels || channels.length === 0) return data;
    return data.filter(item => channels.includes(item.channel));
  };

  /**
   * KPI 집계 계산
   */
  const calculateAggregateKPI = (data: EnhancedPerformanceData[]): KPIAggregateData => {
    const totals = data.reduce(
      (acc, item) => ({
        impressions: acc.impressions + item.impressions,
        clicks: acc.clicks + item.clicks,
        conversions: acc.conversions + item.conversions,
        cost: acc.cost + item.cost,
        revenue: acc.revenue + item.revenue
      }),
      { impressions: 0, clicks: 0, conversions: 0, cost: 0, revenue: 0 }
    );

    const avgCTR = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;
    const avgROAS = totals.cost > 0 ? totals.revenue / totals.cost : 0;
    const avgCPA = totals.conversions > 0 ? totals.cost / totals.conversions : 0;
    const avgConversionRate = totals.clicks > 0 ? (totals.conversions / totals.clicks) * 100 : 0;

    return {
      totalImpressions: totals.impressions,
      totalClicks: totals.clicks,
      totalConversions: totals.conversions,
      totalCost: totals.cost,
      totalRevenue: totals.revenue,
      averageCTR: Math.round(avgCTR * 100) / 100,
      averageROAS: Math.round(avgROAS * 100) / 100,
      averageCPA: Math.round(avgCPA),
      averageConversionRate: Math.round(avgConversionRate * 100) / 100
    };
  };

  /**
   * 정적 데이터 로딩 함수
   */
  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // 정적 데이터 로드
      let rawData: PerformanceData[] = getCurrentData();

      // 필터링 적용
      if (filters.startDate || filters.endDate) {
        rawData = filterByDateRange(rawData, filters.startDate, filters.endDate);
      }

      if (filters.channel && filters.channel.length > 0) {
        rawData = filterByChannels(rawData, filters.channel);
      }

      // 향상된 데이터 생성
      const enhancedData = enhancePerformanceData(rawData);

      // 페이징 적용
      const limit = filters.limit || 50;
      const page = filters.page || 1;
      const offset = (page - 1) * limit;
      const paginatedData = enhancedData.slice(offset, offset + limit);

      // KPI 계산
      const aggregateKPI = calculateAggregateKPI(enhancedData);

      setData(paginatedData);
      setKpiData(aggregateKPI);

      console.log(`✅ 정적 데이터 로드 완료: ${paginatedData.length}개 레코드`);
    } catch (err) {
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('정적 데이터 로딩 오류:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  /**
   * 필터 업데이트 함수
   */
  const updateFilters = useCallback((newFilters: FilterParams) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));

    if (newFilters.page) {
      setCurrentPage(newFilters.page);
    }
  }, []);

  /**
   * 데이터 다시 불러오기
   */
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  /**
   * 필터 변경 시 데이터 다시 로드
   */
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    kpiData,
    loading,
    error,
    totalPages,
    currentPage,
    refetch,
    updateFilters
  };
}

/**
 * 필터 상태를 관리하는 커스텀 훅
 */
export function useFilters(initialFilters: FilterParams = {}) {
  const [filters, setFilters] = useState<FilterParams>({
    startDate: initialFilters.startDate,
    endDate: initialFilters.endDate,
    channel: initialFilters.channel || [],
    page: initialFilters.page || 1,
    limit: initialFilters.limit || 50
  });

  /**
   * 날짜 범위 설정
   */
  const setDateRange = useCallback((startDate?: string, endDate?: string) => {
    setFilters(prev => ({
      ...prev,
      startDate,
      endDate,
      page: 1 // 필터 변경 시 첫 페이지로 리셋
    }));
  }, []);

  /**
   * 채널 필터 설정
   */
  const setChannelFilter = useCallback((channels: string[]) => {
    setFilters(prev => ({
      ...prev,
      channel: channels,
      page: 1 // 필터 변경 시 첫 페이지로 리셋
    }));
  }, []);

  /**
   * 페이지 설정
   */
  const setPage = useCallback((page: number) => {
    setFilters(prev => ({
      ...prev,
      page
    }));
  }, []);

  /**
   * 필터 초기화
   */
  const resetFilters = useCallback(() => {
    setFilters({
      startDate: undefined,
      endDate: undefined,
      channel: [],
      page: 1,
      limit: 50
    });
  }, []);

  /**
   * 사전 정의된 날짜 범위 설정
   */
  const setPresetDateRange = useCallback((preset: 'last7days' | 'last30days' | 'last90days') => {
    const endDate = new Date();
    const startDate = new Date();

    switch (preset) {
      case 'last7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case 'last90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
    }

    setDateRange(
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    );
  }, [setDateRange]);

  return {
    filters,
    setDateRange,
    setChannelFilter,
    setPage,
    resetFilters,
    setPresetDateRange
  };
}
