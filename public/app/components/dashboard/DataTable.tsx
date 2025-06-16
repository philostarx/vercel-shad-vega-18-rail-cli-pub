'use client';

import { useMemo, useCallback } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { ColDef, GridOptions, ICellRendererParams, RowClickedEvent } from 'ag-grid-community';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatters } from '@/lib/api';
import { EnhancedPerformanceData } from '@/lib/types';
import { Table, Download, TrendingUp, TrendingDown } from 'lucide-react';

// AG Grid CSS 임포트 (전역에서 한 번만)
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

interface DataTableProps {
  data: EnhancedPerformanceData[];
  loading?: boolean;
  onRowClick?: (data: EnhancedPerformanceData) => void;
}

/**
 * AG Grid를 사용한 성과 데이터 테이블 컴포넌트
 */
export function DataTable({ data, loading = false, onRowClick }: DataTableProps) {

  /**
   * 퍼센티지 렌더러 (셀 커스텀 렌더링)
   */
  const PercentageRenderer = useCallback(({ value }: ICellRendererParams) => {
    if (value == null) return '-';

    const isGood = value > 3; // CTR 3% 이상 또는 전환율 3% 이상을 좋은 성과로 간주

    return (
      <div className="flex items-center gap-1">
        <span>{formatters.percentage(value)}</span>
        {isGood ? (
          <TrendingUp className="h-3 w-3 text-green-600" />
        ) : (
          <TrendingDown className="h-3 w-3 text-red-600" />
        )}
      </div>
    );
  }, []);

  /**
   * ROAS 렌더러 (조건부 색상 적용)
   */
  const ROASRenderer = useCallback(({ value }: ICellRendererParams) => {
    if (value == null) return '-';

    const variant = value >= 4 ? 'default' : value >= 2 ? 'secondary' : 'destructive';

    return (
      <Badge variant={variant}>
        {value.toFixed(2)}
      </Badge>
    );
  }, []);

  /**
   * 통화 렌더러
   */
  const CurrencyRenderer = useCallback(({ value }: ICellRendererParams) => {
    if (value == null) return '-';
    return formatters.currency(value);
  }, []);

  /**
   * 숫자 렌더러
   */
  const NumberRenderer = useCallback(({ value }: ICellRendererParams) => {
    if (value == null) return '-';
    return formatters.number(value);
  }, []);

  /**
   * 날짜 렌더러
   */
  const DateRenderer = useCallback(({ value }: ICellRendererParams) => {
    if (value == null) return '-';
    return formatters.date(value);
  }, []);

  /**
   * Column definitions
   */
  const columnDefs: ColDef[] = useMemo(() => [
    {
      headerName: 'Date',
      field: 'date',
      width: 100,
      cellRenderer: DateRenderer,
      sort: 'desc', // 기본 정렬
      pinned: 'left'
    },
    {
      headerName: 'Campaign Name',
      field: 'campaignName',
      width: 200,
      pinned: 'left'
    },
    {
      headerName: 'Channel',
      field: 'channel',
      width: 100,
      cellRenderer: ({ value }: ICellRendererParams) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      headerName: 'Impressions',
      field: 'impressions',
      width: 120,
      cellRenderer: NumberRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'Clicks',
      field: 'clicks',
      width: 120,
      cellRenderer: NumberRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'Conversions',
      field: 'conversions',
      width: 120,
      cellRenderer: NumberRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'Cost',
      field: 'cost',
      width: 140,
      cellRenderer: CurrencyRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'Revenue',
      field: 'revenue',
      width: 140,
      cellRenderer: CurrencyRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'CTR (%)',
      field: 'ctr',
      width: 100,
      cellRenderer: PercentageRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'ROAS',
      field: 'roas',
      width: 100,
      cellRenderer: ROASRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'CPA',
      field: 'cpa',
      width: 120,
      cellRenderer: CurrencyRenderer,
      type: 'numericColumn'
    },
    {
      headerName: 'Conversion Rate (%)',
      field: 'conversionRate',
      width: 120,
      cellRenderer: PercentageRenderer,
      type: 'numericColumn'
    }
  ], [PercentageRenderer, ROASRenderer, CurrencyRenderer, NumberRenderer, DateRenderer]);

  /**
   * Grid options configuration
   */
  const gridOptions: GridOptions = useMemo(() => ({
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      minWidth: 80
    },
    enableRangeSelection: true,
    rowSelection: 'single',
    animateRows: true,
    pagination: true,
    paginationPageSize: 20,
    suppressHorizontalScroll: false,
    getRowStyle: ({ node }) => {
      if (node.rowIndex !== undefined && node.rowIndex !== null && node.rowIndex % 2 === 0) {
        return { backgroundColor: '#fafafa' };
      }
      return undefined;
    }
  }), []);

  /**
   * Row click handler
   */
  const onRowClicked = useCallback((event: RowClickedEvent) => {
    if (onRowClick && event.data) {
      onRowClick(event.data);
    }
  }, [onRowClick]);

  /**
   * CSV export function
   */
  const exportToCsv = useCallback(() => {
    const csvContent = convertToCSV(data);
    downloadCSV(csvContent, 'performance-data.csv');
  }, [data]);

  /**
   * CSV conversion utility
   */
  const convertToCSV = (data: EnhancedPerformanceData[]): string => {
    const headers = [
      'Date', 'Campaign Name', 'Channel', 'Impressions', 'Clicks', 'Conversions',
      'Cost', 'Revenue', 'CTR(%)', 'ROAS', 'CPA', 'Conversion Rate(%)'
    ];

    const rows = data.map(row => [
      row.date,
      row.campaignName,
      row.channel,
      row.impressions,
      row.clicks,
      row.conversions,
      row.cost,
      row.revenue,
      row.ctr,
      row.roas,
      row.cpa,
      row.conversionRate
    ]);

    return [headers, ...rows].map(row =>
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  /**
   * CSV download utility
   */
  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Performance Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Loading skeleton */}
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            Performance Data
            <Badge variant="secondary" className="ml-2">
              {data.length} items
            </Badge>
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCsv}
            disabled={data.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="ag-theme-alpine" style={{ height: '500px', width: '100%' }}>
          <AgGridReact
            rowData={data}
            columnDefs={columnDefs}
            gridOptions={gridOptions}
            onRowClicked={onRowClicked}
            overlayLoadingTemplate='<span class="ag-overlay-loading-center">Loading data...</span>'
            overlayNoRowsTemplate='<span class="ag-overlay-no-rows-center">No data to display.</span>'
          />
        </div>
      </CardContent>
    </Card>
  );
}
