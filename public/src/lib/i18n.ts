/**
 * 국제화(i18n) 설정 및 번역 텍스트 정의
 * 작성자: ft.s.curs
 * 작성일: 2025년 1월 8일
 */

export interface Translations {
  // Header
  header: {
    title: string;
    lastUpdate: string;
    refresh: string;
    refreshing: string;
    timeAgo: {
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
      daysAgo: string;
      noInfo: string;
    };
  };

  // KPI Cards
  kpi: {
    title: string;
    totalImpressions: string;
    totalClicks: string;
    totalConversions: string;
    totalCost: string;
    avgROAS: string;
    descriptions: {
      impressions: string;
      clicks: string;
      conversions: string;
      cost: string;
      roas: string;
    };
  };

  // Charts
  charts: {
    performanceAnalysis: string;
    dailyTrend: string;
    channelDistribution: string;
    roasComparison: string;
    loading: string;
    clicks: string;
    conversions: string;
    date: string;
    quantity: string;
    channel: string;
    cost: string;
    ratio: string;
    targetROAS: string;
    evaluation: {
      excellent: string;
      good: string;
      needsImprovement: string;
    };
  };

  // Filters
  filters: {
    title: string;
    active: string;
    period: string;
    selectPeriod: string;
    channel: string;
    selectAll: string;
    deselectAll: string;
    selected: string;
    reset: string;
    dateRange: {
      start: string;
      end: string;
    };
    presets: {
      last7Days: string;
      last30Days: string;
      last90Days: string;
    };
  };

  // Data Table
  table: {
    title: string;
    items: string;
    export: string;
    loading: string;
    noData: string;
    columns: {
      date: string;
      campaignName: string;
      channel: string;
      impressions: string;
      clicks: string;
      conversions: string;
      cost: string;
      revenue: string;
      ctr: string;
      roas: string;
      cpa: string;
      conversionRate: string;
    };
  };

  // General
  general: {
    loading: string;
    error: string;
    retry: string;
    selectedCampaign: string;
    campaign: string;
    totalItems: string;
    filtersApplied: string;
  };

  // Footer
  footer: {
    copyright: string;
    version: string;
    developer: string;
    tech: string;
  };
}

export const translations: Record<string, Translations> = {
  en: {
    header: {
      title: "Marketing Performance Dashboard",
      lastUpdate: "Last Updated:",
      refresh: "Refresh",
      refreshing: "Refreshing...",
      timeAgo: {
        justNow: "Just now",
        minutesAgo: "minutes ago",
        hoursAgo: "hours ago",
        daysAgo: "days ago",
        noInfo: "No information"
      }
    },
    kpi: {
      title: "Key Performance Indicators",
      totalImpressions: "Total Impressions",
      totalClicks: "Total Clicks",
      totalConversions: "Total Conversions",
      totalCost: "Total Cost",
      avgROAS: "Average ROAS",
      descriptions: {
        impressions: "Total ad impressions",
        clicks: "Total ad clicks",
        conversions: "Total conversions (purchases)",
        cost: "Total advertising spend",
        roas: "Return on Ad Spend (Revenue/Cost)"
      }
    },
    charts: {
      performanceAnalysis: "Performance Analysis",
      dailyTrend: "Daily Performance Trend",
      channelDistribution: "Channel Budget Distribution",
      roasComparison: "ROAS Comparison by Channel",
      loading: "Loading chart...",
      clicks: "Clicks",
      conversions: "Conversions",
      date: "Date",
      quantity: "Quantity",
      channel: "Channel",
      cost: "Cost",
      ratio: "Ratio",
      targetROAS: "Target ROAS (4.0)",
      evaluation: {
        excellent: "Excellent",
        good: "Good",
        needsImprovement: "Needs Improvement"
      }
    },
    filters: {
      title: "Filters",
      active: "active",
      period: "Period",
      selectPeriod: "Select a period",
      channel: "Channel",
      selectAll: "Select All",
      deselectAll: "Deselect All",
      selected: "channels selected",
      reset: "Reset",
      dateRange: {
        start: "Start:",
        end: "End:"
      },
      presets: {
        last7Days: "Last 7 Days",
        last30Days: "Last 30 Days",
        last90Days: "Last 90 Days"
      }
    },
    table: {
      title: "Performance Data",
      items: "items",
      export: "Export CSV",
      loading: "Loading data...",
      noData: "No data to display.",
      columns: {
        date: "Date",
        campaignName: "Campaign Name",
        channel: "Channel",
        impressions: "Impressions",
        clicks: "Clicks",
        conversions: "Conversions",
        cost: "Cost",
        revenue: "Revenue",
        ctr: "CTR (%)",
        roas: "ROAS",
        cpa: "CPA",
        conversionRate: "Conversion Rate (%)"
      }
    },
    general: {
      loading: "Loading...",
      error: "Data Loading Error",
      retry: "Try Again",
      selectedCampaign: "Selected Campaign",
      campaign: "Campaign:",
      totalItems: "Total",
      filtersApplied: "filters applied"
    },
    footer: {
      copyright: "Marketing Performance Dashboard",
      version: "v3.0 - Vega Migration",
      developer: "Developer: ft.s.curs",
      tech: "Next.js + Vega-Lite + AG Grid"
    }
  },
  ko: {
    header: {
      title: "마케팅 성과 대시보드",
      lastUpdate: "마지막 업데이트:",
      refresh: "새로고침",
      refreshing: "새로고침 중...",
      timeAgo: {
        justNow: "방금 전",
        minutesAgo: "분 전",
        hoursAgo: "시간 전",
        daysAgo: "일 전",
        noInfo: "정보 없음"
      }
    },
    kpi: {
      title: "주요 성과 지표",
      totalImpressions: "총 노출수",
      totalClicks: "총 클릭수",
      totalConversions: "총 전환수",
      totalCost: "총 비용",
      avgROAS: "평균 ROAS",
      descriptions: {
        impressions: "전체 광고 노출 횟수",
        clicks: "전체 광고 클릭 횟수",
        conversions: "전체 전환(구매) 횟수",
        cost: "전체 광고 집행 비용",
        roas: "광고 수익률 (Revenue/Cost)"
      }
    },
    charts: {
      performanceAnalysis: "성과 분석",
      dailyTrend: "일자별 성과 트렌드",
      channelDistribution: "채널별 예산 배분",
      roasComparison: "채널별 ROAS 비교",
      loading: "차트 로딩 중...",
      clicks: "클릭수",
      conversions: "전환수",
      date: "날짜",
      quantity: "수량",
      channel: "채널",
      cost: "비용",
      ratio: "비율",
      targetROAS: "목표 ROAS (4.0)",
      evaluation: {
        excellent: "우수",
        good: "보통",
        needsImprovement: "개선 필요"
      }
    },
    filters: {
      title: "필터",
      active: "개 활성",
      period: "기간",
      selectPeriod: "기간을 선택하세요",
      channel: "채널",
      selectAll: "전체 선택",
      deselectAll: "전체 해제",
      selected: "개 채널 선택됨",
      reset: "초기화",
      dateRange: {
        start: "시작:",
        end: "종료:"
      },
      presets: {
        last7Days: "최근 7일",
        last30Days: "최근 30일",
        last90Days: "최근 90일"
      }
    },
    table: {
      title: "성과 데이터",
      items: "개 항목",
      export: "CSV 내보내기",
      loading: "데이터를 불러오는 중...",
      noData: "표시할 데이터가 없습니다.",
      columns: {
        date: "날짜",
        campaignName: "캠페인명",
        channel: "채널",
        impressions: "노출수",
        clicks: "클릭수",
        conversions: "전환수",
        cost: "비용",
        revenue: "매출",
        ctr: "CTR (%)",
        roas: "ROAS",
        cpa: "CPA",
        conversionRate: "전환율 (%)"
      }
    },
    general: {
      loading: "로딩 중...",
      error: "데이터 로딩 오류",
      retry: "다시 시도",
      selectedCampaign: "선택된 캠페인",
      campaign: "캠페인:",
      totalItems: "총",
      filtersApplied: "필터 적용됨"
    },
    footer: {
      copyright: "마케팅 성과 대시보드",
      version: "v3.0 - Vega 마이그레이션",
      developer: "개발: ft.s.curs",
      tech: "Next.js + Vega-Lite + AG Grid"
    }
  }
};

// 기본 언어 설정 (영문)
export const DEFAULT_LOCALE = 'en';

// 언어별 포맷터 생성 함수
export const getFormatters = (locale: string = DEFAULT_LOCALE) => {
  const currency = locale === 'en' ? 'USD' : 'KRW';
  const localeCode = locale === 'en' ? 'en-US' : 'ko-KR';

  return {
    currency: (value: number): string => {
      return new Intl.NumberFormat(localeCode, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
      }).format(value);
    },

    number: (value: number): string => {
      return new Intl.NumberFormat(localeCode).format(value);
    },

    percentage: (value: number, decimals: number = 2): string => {
      return `${value.toFixed(decimals)}%`;
    },

    date: (dateString: string): string => {
      return new Date(dateString).toLocaleDateString(localeCode);
    }
  };
}; 