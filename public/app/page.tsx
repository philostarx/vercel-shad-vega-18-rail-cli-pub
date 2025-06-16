'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './components/layout/Layout';
import { KPICard, KPIGrid } from './components/dashboard/KPICard';
import { FilterControls } from './components/dashboard/FilterControls';
import { DataTable } from './components/dashboard/DataTable';
import {
  TrendChart,
  ChannelDistributionChart,
  ROASComparisonChart
} from './components/dashboard/PerformanceChart';
import { usePerformanceData, useFilters } from '@/hooks/usePerformanceData';
import { EnhancedPerformanceData, FilterParams } from '@/lib/types';
import {
  TrendingUp,
  MousePointer,
  Target,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useTranslation } from '@/hooks/useI18n';

// 임시 에러 처리 컴포넌트들 (인라인)
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="p-4 bg-gray-100 rounded-lg">
          <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-400">로딩 중...</div>
    </div>
  </div>
);

const ErrorFallback = ({ error, onRetry, showRetry = true }: {
  error: string;
  onRetry: () => void;
  showRetry?: boolean;
}) => (
  <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
    <div className="text-red-600 text-lg font-medium mb-4">데이터를 불러올 수 없습니다</div>
    <p className="text-red-700 mb-4 text-center">{error}</p>
    {showRetry && (
      <button onClick={onRetry} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        다시 시도
      </button>
    )}
  </div>
);

const NetworkStatus = () => null; // 간단화

const ApiStatus = ({ apiUrl }: { apiUrl: string }) => (
  <span className="text-xs text-gray-400">
    API: {apiUrl.replace('https://', '').replace('http://', '')}
  </span>
);

/**
 * 메인 대시보드 페이지 컴포넌트
 */
export default function Dashboard() {
  const t = useTranslation();
  const [lastUpdated, setLastUpdated] = useState<string>();
  const [selectedRow, setSelectedRow] = useState<EnhancedPerformanceData | null>(null);

  // 필터 상태 관리
  const { filters } = useFilters({
    page: 1,
    limit: 50
  });

  // 성과 데이터 관리
  const {
    data,
    kpiData,
    loading,
    error,
    refetch,
    updateFilters
  } = usePerformanceData(filters);



  /**
   * 컴포넌트 마운트 시 마지막 업데이트 시간 설정
   */
  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  /**
   * 필터 변경 핸들러
   */
  const handleFilterChange = (newFilters: FilterParams) => {
    updateFilters(newFilters);
  };

  /**
   * 데이터 새로고침 핸들러
   */
  const handleRefresh = () => {
    refetch();
    setLastUpdated(new Date().toISOString());
  };

  /**
   * 테이블 행 클릭 핸들러
   */
  const handleRowClick = (rowData: EnhancedPerformanceData) => {
    setSelectedRow(rowData);
    console.log('선택된 행:', rowData);
  };

  /**
   * 로딩 상태 렌더링
   */
  if (loading && !data.length) {
    return (
      <DashboardLayout
        headerProps={{
          onRefresh: handleRefresh,
          loading: loading,
          lastUpdated: lastUpdated
        }}
      >
        <LoadingSkeleton />
      </DashboardLayout>
    );
  }

  /**
   * 에러 상태 렌더링 (개선됨)
   */
  if (error && !data.length) {
    return (
      <DashboardLayout
        headerProps={{
          onRefresh: handleRefresh,
          loading: loading,
          lastUpdated: lastUpdated
        }}
      >
        <ErrorFallback
          error={error}
          onRetry={handleRefresh}
          showRetry={true}
        />
      </DashboardLayout>
    );
  }

  return (
    <>
      {/* 네트워크 상태 표시 */}
      <NetworkStatus />

      <DashboardLayout
        headerProps={{
          onRefresh: handleRefresh,
          loading: loading,
          lastUpdated: lastUpdated
        }}
      >
        {/* 에러 표시 (상단에 간단하게) */}
        {error && data.length > 0 && (
          <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-700">
            ⚠️ 일부 데이터 로드에 실패했지만 캐시된 데이터를 표시합니다.
          </div>
        )}



        {/* KPI 카드 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t.kpi.title}</h2>
          <KPIGrid>
            <KPICard
              title={t.kpi.totalImpressions}
              value={kpiData?.totalImpressions || 0}
              format="number"
              icon={BarChart3}
              description={t.kpi.descriptions.impressions}
              loading={loading}
            />
            <KPICard
              title={t.kpi.totalClicks}
              value={kpiData?.totalClicks || 0}
              format="number"
              icon={MousePointer}
              description={t.kpi.descriptions.clicks}
              loading={loading}
            />
            <KPICard
              title={t.kpi.totalConversions}
              value={kpiData?.totalConversions || 0}
              format="number"
              icon={Target}
              description={t.kpi.descriptions.conversions}
              loading={loading}
            />
            <KPICard
              title={t.kpi.totalCost}
              value={kpiData?.totalCost || 0}
              format="currency"
              icon={DollarSign}
              description={t.kpi.descriptions.cost}
              loading={loading}
            />
            <KPICard
              title={t.kpi.avgROAS}
              value={kpiData?.averageROAS || 0}
              format="number"
              icon={TrendingUp}
              description={t.kpi.descriptions.roas}
              loading={loading}
              trend={
                kpiData?.averageROAS ? {
                  value: kpiData.averageROAS > 4 ? 15.2 : -8.4,
                  isPositive: kpiData.averageROAS > 4
                } : undefined
              }
            />
          </KPIGrid>
        </section>

        {/* 차트 섹션 */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">{t.charts.performanceAnalysis}</h2>

          {/* 상단 차트 그리드 - 2열 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="min-w-0">
              <TrendChart data={data} loading={loading} />
            </div>
            <div className="min-w-0">
              <ChannelDistributionChart data={data} loading={loading} />
            </div>
          </div>

          {/* 하단 차트 - 전체 너비 */}
          <div className="grid grid-cols-1 gap-6">
            <div className="min-w-0">
              <ROASComparisonChart data={data} loading={loading} />
            </div>
          </div>
        </section>

        {/* 필터 및 테이블 섹션 */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 필터 컨트롤 */}
          <div className="lg:col-span-1">
            <FilterControls
              onFilterChange={handleFilterChange}
              currentFilters={filters}
              loading={loading}
            />

            {/* Selected row information (if any) */}
            {selectedRow && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Selected Campaign</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div><strong>Campaign:</strong> {selectedRow.campaignName}</div>
                  <div><strong>Channel:</strong> {selectedRow.channel}</div>
                  <div><strong>ROAS:</strong> {selectedRow.roas.toFixed(2)}</div>
                  <div><strong>CTR:</strong> {selectedRow.ctr.toFixed(2)}%</div>
                </div>
              </div>
            )}
          </div>

          {/* 데이터 테이블 */}
          <div className="lg:col-span-3">
            <DataTable
              data={data}
              loading={loading}
              onRowClick={handleRowClick}
            />
          </div>
        </section>

        {/* 상태 정보 섹션 (하단) */}
        {!loading && (
          <section className="text-center text-sm text-muted-foreground border-t pt-4 mt-8">
            <p>
              {t.general.totalItems} {data.length} {t.table.items} displayed.
              {filters.channel && filters.channel.length > 0 && (
                <span> ({filters.channel.join(', ')} {t.general.filtersApplied})</span>
              )}
            </p>
            <div className="mt-2 flex flex-col items-center space-y-1 text-xs text-gray-500">
              <div>
                데이터 소스: {process.env.NEXT_PUBLIC_DATA_SOURCE?.toUpperCase() || 'JSON'} |
                마지막 업데이트: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
              </div>
              <div>
                <ApiStatus apiUrl={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'} />
              </div>
            </div>
          </section>
        )}
      </DashboardLayout>
    </>
  );
}
