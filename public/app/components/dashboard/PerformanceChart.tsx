/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useMemo } from 'react';
import { VegaLite } from 'react-vega';
import { TopLevelSpec } from 'vega-lite';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedPerformanceData, TimeSeriesData } from '@/lib/types';
import { TrendingUp, PieChart, BarChart3 } from 'lucide-react';

interface PerformanceChartProps {
  data: EnhancedPerformanceData[];
  loading?: boolean;
}

/**
 * Daily Trend Line Chart Component (실제 데이터 사용)
 */
export function TrendChart({ data, loading = false }: PerformanceChartProps) {
  // 실제 데이터 처리 (간소화된 버전)
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 날짜별로 데이터 그룹핑 (간단한 버전)
    const groupedData = data.reduce((acc, item) => {
      const date = item.date;
      if (!acc[date]) {
        acc[date] = { date, clicks: 0, conversions: 0 };
      }
      acc[date].clicks += item.clicks;
      acc[date].conversions += item.conversions;
      return acc;
    }, {} as Record<string, { date: string; clicks: number; conversions: number }>);

    return Object.values(groupedData).sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  // 폴백 데이터 (차트 데이터가 없을 때)
  const fallbackData = [
    { date: '2024-01-01', value: 100, metric: 'Clicks' },
    { date: '2024-01-02', value: 150, metric: 'Clicks' },
    { date: '2024-01-03', value: 120, metric: 'Clicks' },
    { date: '2024-01-01', value: 20, metric: 'Conversions' },
    { date: '2024-01-02', value: 30, metric: 'Conversions' },
    { date: '2024-01-03', value: 25, metric: 'Conversions' }
  ];

  // Vega-Lite 스펙 (개선된 autosize 설정)
  const vegaSpec: TopLevelSpec = useMemo(() => {
    const vegaData = chartData.length > 0
      ? chartData.flatMap(item => [
        { date: item.date, value: item.clicks, metric: 'Clicks' },
        { date: item.date, value: item.conversions, metric: 'Conversions' }
      ])
      : fallbackData;

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 240,
      padding: { left: 50, right: 20, top: 30, bottom: 40 },
      autosize: {
        type: 'fit',
        contains: 'content',
        resize: true
      },
      background: 'transparent',
      title: {
        text: 'Daily Performance Trend',
        anchor: 'middle',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151'
      },
      data: { values: vegaData },
      mark: { 
        type: 'line', 
        point: { size: 60, filled: true }, 
        strokeWidth: 2,
        interpolate: 'monotone'
      },
      encoding: {
        x: {
          field: 'date',
          type: 'temporal',
          axis: { 
            title: 'Date', 
            format: '%m/%d',
            labelAngle: 0,
            grid: false
          }
        },
        y: {
          field: 'value',
          type: 'quantitative',
          axis: { 
            title: 'Count',
            grid: true,
            gridOpacity: 0.3
          }
        },
        color: {
          field: 'metric',
          type: 'nominal',
          scale: { range: ['#3B82F6', '#84CC16'] },
          legend: null
        }
      }
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Daily Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Daily Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 커스텀 범례 */}
        <div className="flex items-center justify-center gap-6 py-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">Clicks</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600">Conversions (x8)</span>
          </div>
        </div>
        <div className="w-full h-72 rounded overflow-hidden">
          <VegaLite 
            spec={vegaSpec} 
            actions={false} 
            renderer="svg"
            onError={(error) => console.error('Vega rendering error:', error)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Channel Budget Distribution Donut Chart Component
 */
export function ChannelDistributionChart({ data, loading = false }: PerformanceChartProps) {
  // 실제 데이터 처리
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 채널별로 비용 합계 계산
    const channelData = data.reduce((acc, item) => {
      if (!acc[item.channel]) {
        acc[item.channel] = 0;
      }
      acc[item.channel] += item.cost;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(channelData).map(([channel, cost]) => ({
      channel,
      cost
    }));
  }, [data]);

  const vegaSpec: TopLevelSpec = useMemo(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 240,
    padding: { left: 20, right: 20, top: 30, bottom: 20 },
    autosize: {
      type: 'fit',
      contains: 'content',
      resize: true
    },
    background: 'transparent',
    title: {
      text: 'Channel Budget Distribution',
      anchor: 'middle',
      fontSize: 14,
      fontWeight: 'bold',
      color: '#374151'
    },
    data: { values: chartData },
    mark: { 
      type: 'arc', 
      innerRadius: 45, 
      outerRadius: 90,
      stroke: '#ffffff',
      strokeWidth: 2
    },
    encoding: {
      theta: { 
        field: 'cost', 
        type: 'quantitative',
        scale: { type: 'linear', range: [0, 6.28] }
      },
      color: {
        field: 'channel',
        type: 'nominal',
        scale: { 
          range: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'] 
        },
        legend: null
      },
      tooltip: [
        { field: 'channel', type: 'nominal', title: 'Channel' },
        { field: 'cost', type: 'quantitative', format: '$,.0f', title: 'Cost' }
      ]
    }
  }), [chartData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Channel Budget Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Channel Budget Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 커스텀 범례 */}
        <div className="flex items-center justify-center gap-4 py-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-900"></div>
            <span className="text-xs text-gray-600">YouTube</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-xs text-gray-600">Facebook</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-xs text-gray-600">Google</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-300"></div>
            <span className="text-xs text-gray-600">Instagram</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-100"></div>
            <span className="text-xs text-gray-600">Naver</span>
          </div>
        </div>
        <div className="w-full h-72 rounded overflow-hidden">
          <VegaLite 
            spec={vegaSpec} 
            actions={false} 
            renderer="svg"
            onError={(error) => console.error('Vega rendering error:', error)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Channel ROAS Comparison Bar Chart Component
 */
export function ROASComparisonChart({ data, loading = false }: PerformanceChartProps) {
  // 실제 데이터 처리
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 채널별로 ROAS 계산
    const channelData = data.reduce((acc, item) => {
      if (!acc[item.channel]) {
        acc[item.channel] = { totalCost: 0, totalRevenue: 0 };
      }
      acc[item.channel].totalCost += item.cost;
      acc[item.channel].totalRevenue += item.revenue;
      return acc;
    }, {} as Record<string, { totalCost: number; totalRevenue: number }>);

    return Object.entries(channelData).map(([channel, data]) => ({
      channel,
      roas: data.totalCost > 0 ? data.totalRevenue / data.totalCost : 0
    }));
  }, [data]);

  const vegaSpec: TopLevelSpec = useMemo(() => {
    // 채널별 동적 타겟 ROAS 설정 (실제적인 등락 적용)
    const targetROASByChannel: Record<string, number> = {
      'Facebook': 3.2,
      'Google': 4.8,
      'Instagram': 3.8,
      'Naver': 4.2,
      'YouTube': 4.5
    };

    const chartDataWithTarget = chartData.map(item => ({
      ...item,
      targetROAS: targetROASByChannel[item.channel] || 4.0
    }));

    return {
      $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
      width: 'container',
      height: 240,
      padding: { left: 50, right: 20, top: 30, bottom: 50 },
      autosize: {
        type: 'fit',
        contains: 'content',
        resize: true
      },
      background: 'transparent',
      title: {
        text: 'Channel ROAS Comparison',
        anchor: 'middle',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#374151'
      },
      data: { values: chartDataWithTarget },
      layer: [
        {
          // 막대 차트 (ROAS)
          mark: { 
            type: 'bar', 
            stroke: '#ffffff', 
            strokeWidth: 1,
            cornerRadiusTopLeft: 4,
            cornerRadiusTopRight: 4,
            width: { band: 0.5 }
          },
          encoding: {
            x: {
              field: 'channel',
              type: 'nominal',
              axis: { 
                title: 'Channel',
                labelAngle: -45,
                grid: false
              }
            },
            y: {
              field: 'roas',
              type: 'quantitative',
              axis: { 
                title: 'ROAS', 
                format: '.1f',
                grid: true,
                gridOpacity: 0.3
              }
            },
            color: {
              field: 'channel',
              type: 'nominal',
              scale: { range: ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'] },
              legend: null
            },
            tooltip: [
              { field: 'channel', type: 'nominal', title: 'Channel' },
              { field: 'roas', type: 'quantitative', format: '.2f', title: 'ROAS' }
            ]
          }
        },
        {
          // 타겟 ROAS 라인 (실선으로 변경)
          mark: {
            type: 'line',
            color: '#84CC16',
            strokeWidth: 3,
            point: true
          },
          encoding: {
            x: {
              field: 'channel',
              type: 'nominal'
            },
            y: {
              field: 'targetROAS',
              type: 'quantitative'
            },
            color: {
              value: '#84CC16',
              legend: null
            },
            tooltip: [
              { field: 'channel', type: 'nominal', title: 'Channel' },
              { field: 'targetROAS', type: 'quantitative', format: '.1f', title: 'Target ROAS' }
            ]
          }
        }
      ]
    };
  }, [chartData]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Channel ROAS Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72 bg-gray-100 rounded animate-pulse flex items-center justify-center">
            <span className="text-gray-500">Loading...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Channel ROAS Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 커스텀 범례 */}
        <div className="flex items-center justify-center gap-6 py-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-gradient-to-r from-blue-900 to-blue-100 rounded"></div>
            <span className="text-sm text-gray-600">ROAS</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600">Target ROAS (Dynamic)</span>
          </div>
        </div>
        <div className="w-full h-72 rounded overflow-hidden">
          <VegaLite 
            spec={vegaSpec} 
            actions={false} 
            renderer="svg"
            onError={(error) => console.error('Vega rendering error:', error)}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
