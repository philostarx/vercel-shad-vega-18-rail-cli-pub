// 마케팅 성과 데이터 타입 정의
export interface PerformanceData {
  id: number;
  campaignName: string;
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
  date: string;
}

// 계산된 KPI 타입
export interface CalculatedKPI {
  ctr: number; // Click Through Rate (%)
  roas: number; // Return on Ad Spend
  cpa: number; // Cost Per Acquisition
  conversionRate: number; // Conversion Rate (%)
}

// 전체 성과 데이터 (계산 필드 포함)
export interface EnhancedPerformanceData extends PerformanceData, CalculatedKPI { }

// KPI 집계 데이터
export interface KPIAggregateData {
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalCost: number;
  totalRevenue: number;
  averageCTR: number;
  averageROAS: number;
  averageCPA: number;
  averageConversionRate: number;
}

// 채널별 성과 데이터
export interface ChannelPerformance {
  channel: string;
  totalCost: number;
  totalRevenue: number;
  roas: number;
  conversions: number;
  clicks: number;
  impressions: number;
}

// API 응답 형태
export interface ApiResponse<T> {
  status: 'success' | 'error';
  data: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    message?: string;
  };
}

// 필터 조건
export interface FilterParams {
  startDate?: string;
  endDate?: string;
  channel?: string[];
  page?: number;
  limit?: number;
}

// 차트 데이터 타입
export interface ChartDataPoint {
  label: string;
  value: number;
  category?: string;
}

export interface TimeSeriesData {
  date: string;
  clicks: number;
  conversions: number;
  cost: number;
  revenue: number;
}

// Mock 시나리오 타입
export type MockScenario = 'current' | 'normal-case' | 'high-performance' | 'low-performance' | 'seasonal-campaign';
