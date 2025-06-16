'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFormatters } from '@/hooks/useI18n';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: number;
  format: 'currency' | 'number' | 'percentage';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: LucideIcon;
  description?: string;
  loading?: boolean;
}

/**
 * KPI 데이터를 표시하는 카드 컴포넌트
 */
export function KPICard({
  title,
  value,
  format,
  trend,
  icon: Icon,
  description,
  loading = false
}: KPICardProps) {
  const formatters = useFormatters();
  
  /**
   * 값 포맷팅 함수
   */
  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return formatters.currency(val);
      case 'percentage':
        return formatters.percentage(val);
      case 'number':
        return formatters.number(val);
      default:
        return val.toString();
    }
  };

  /**
   * 트렌드 표시 컴포넌트
   */
  const TrendIndicator = ({ trend }: { trend: NonNullable<KPICardProps['trend']> }) => (
    <Badge 
      variant={trend.isPositive ? 'default' : 'destructive'}
      className={`text-xs ${
        trend.isPositive 
          ? 'bg-green-100 text-green-800 hover:bg-green-100' 
          : 'bg-red-100 text-red-800 hover:bg-red-100'
      }`}
    >
      {trend.isPositive ? '+' : ''}{formatters.percentage(trend.value, 1)}
    </Badge>
  );

  if (loading) {
    return (
      <Card className="h-[120px]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">
              {formatValue(value)}
            </div>
            {trend && <TrendIndicator trend={trend} />}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * KPI 카드들을 그리드로 표시하는 컨테이너 컴포넌트
 */
interface KPIGridProps {
  children: React.ReactNode;
  className?: string;
}

export function KPIGrid({ children, className = '' }: KPIGridProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 ${className}`}>
      {children}
    </div>
  );
}
