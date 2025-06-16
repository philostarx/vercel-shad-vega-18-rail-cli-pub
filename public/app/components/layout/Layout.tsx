'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, RefreshCw, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useI18n';
import { LanguageSwitcherCompact } from '@/components/ui/language-switcher-compact';

interface HeaderProps {
  title?: string;
  lastUpdated?: string;
  onRefresh?: () => void;
  loading?: boolean;
}

/**
 * 대시보드 상단 헤더 컴포넌트
 */
export function Header({ 
  title, 
  lastUpdated,
  onRefresh,
  loading = false 
}: HeaderProps) {
  const t = useTranslation();
  
  const formatLastUpdated = (dateString?: string): string => {
    if (!dateString) return t.header.timeAgo.noInfo;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return t.header.timeAgo.justNow;
    if (diffMins < 60) return `${diffMins} ${t.header.timeAgo.minutesAgo}`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ${t.header.timeAgo.hoursAgo}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${t.header.timeAgo.daysAgo}`;
  };

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <BarChart3 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {title || t.header.title}
            </h1>
          </div>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <LanguageSwitcherCompact />
          
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{t.header.lastUpdate}</span>
              <Badge variant="outline">
                {formatLastUpdated(lastUpdated)}
              </Badge>
            </div>
          )}
          
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="min-w-[100px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? t.header.refreshing : t.header.refresh}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

/**
 * 대시보드 하단 푸터 컴포넌트
 */
export function Footer() {
  const t = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-gray-50">
      <div className="flex h-12 items-center justify-between px-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>© {currentYear} {t.footer.copyright}</span>
          <Badge variant="secondary">{t.footer.version}</Badge>
        </div>
        
        <div className="flex items-center gap-4">
          <span>{t.footer.developer}</span>
          <span>•</span>
          <span>{t.footer.tech}</span>
        </div>
      </div>
    </footer>
  );
}

/**
 * 메인 컨텐츠 래퍼 컴포넌트
 */
interface MainContentProps {
  children: React.ReactNode;
  className?: string;
}

export function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main className={`flex-1 overflow-auto bg-gray-50 ${className}`}>
      <div className="container mx-auto p-6 space-y-6">
        {children}
      </div>
    </main>
  );
}

/**
 * 전체 레이아웃 컴포넌트
 */
interface DashboardLayoutProps {
  children: React.ReactNode;
  headerProps?: Omit<HeaderProps, 'children'>;
}

export function DashboardLayout({ children, headerProps }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header {...headerProps} />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </div>
  );
}
