/**
 * 에러 처리 및 로딩 UI 컴포넌트
 * 작성자: ft.clau
 * 작성일: 2025-06-01
 */

import React from 'react';
import { AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 에러 타입 정의
export enum ApiErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  CLIENT_ERROR = 'CLIENT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  details?: unknown;
}

// 에러 처리 유틸리티
export function handleApiError(error: unknown): ApiError {
  // 타입 가드를 사용하여 error 객체의 속성에 안전하게 접근
  const errorObj = error as { name?: string; status?: number; message?: string };

  if (errorObj.name === 'AbortError') {
    return {
      type: ApiErrorType.TIMEOUT_ERROR,
      message: '요청 시간이 초과되었습니다. 다시 시도해주세요.'
    };
  }

  if (errorObj.status && errorObj.status >= 500) {
    return {
      type: ApiErrorType.SERVER_ERROR,
      message: '서버에 일시적인 문제가 발생했습니다.',
      statusCode: errorObj.status
    };
  }

  if (errorObj.status && errorObj.status >= 400) {
    return {
      type: ApiErrorType.CLIENT_ERROR,
      message: errorObj.message || '잘못된 요청입니다.',
      statusCode: errorObj.status
    };
  }

  return {
    type: ApiErrorType.NETWORK_ERROR,
    message: '네트워크 연결을 확인해주세요.'
  };
}

// 에러 폴백 컴포넌트
interface ErrorFallbackProps {
  error: string | ApiError;
  onRetry: () => void;
  showRetry?: boolean;
}

export function ErrorFallback({ error, onRetry, showRetry = true }: ErrorFallbackProps) {
  const errorMessage = typeof error === 'string' ? error : error.message;
  const isNetworkError = typeof error === 'object' && error.type === ApiErrorType.NETWORK_ERROR;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-red-50 rounded-lg border border-red-200">
      <div className="flex items-center mb-4">
        {isNetworkError ? (
          <WifiOff className="w-12 h-12 text-red-500 mr-3" />
        ) : (
          <AlertCircle className="w-12 h-12 text-red-500 mr-3" />
        )}
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-1">
            데이터를 불러올 수 없습니다
          </h3>
          <p className="text-sm text-red-600">
            {errorMessage}
          </p>
        </div>
      </div>
      
      {showRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-2">
          <RefreshCw className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      )}
      
      {isNetworkError && (
        <div className="mt-4 text-sm text-red-600 text-center">
          <p>• 인터넷 연결을 확인해주세요</p>
          <p>• Backend API 서버가 실행 중인지 확인해주세요</p>
        </div>
      )}
    </div>
  );
}

// 로딩 스켈레톤 컴포넌트
export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* KPI 카드 스켈레톤 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 bg-gray-100 rounded-lg">
            <div className="h-4 bg-gray-300 rounded mb-2 w-3/4"></div>
            <div className="h-8 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>

      {/* 차트 스켈레톤 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">차트 로딩 중...</div>
        </div>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-gray-400">차트 로딩 중...</div>
        </div>
      </div>

      {/* 테이블 스켈레톤 */}
      <div className="space-y-3">
        <div className="h-10 bg-gray-200 rounded"></div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded"></div>
        ))}
      </div>
    </div>
  );
}

// 네트워크 상태 표시 컴포넌트
export function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }

    function handleOffline() {
      setIsOnline(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center">
        <WifiOff className="w-4 h-4 mr-2" />
        오프라인 상태입니다. 인터넷 연결을 확인해주세요.
      </div>
    </div>
  );
}

// API 연결 상태 테스트 컴포넌트
interface ApiStatusProps {
  apiUrl: string;
}

export function ApiStatus({ apiUrl }: ApiStatusProps) {
  const [status, setStatus] = React.useState<'checking' | 'connected' | 'error'>('checking');
  const [lastCheck, setLastCheck] = React.useState<Date | null>(null);

  const checkApiStatus = React.useCallback(async () => {
    setStatus('checking');
    try {
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setStatus('connected');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    
    setLastCheck(new Date());
  }, [apiUrl]);

  React.useEffect(() => {
    checkApiStatus();
  }, [checkApiStatus]);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'connected':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'error':
        return <WifiOff className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'checking':
        return 'API 연결 확인 중...';
      case 'connected':
        return 'API 연결됨';
      case 'error':
        return 'API 연결 실패';
    }
  };

  return (
    <div className="flex items-center text-sm text-gray-600">
      {getStatusIcon()}
      <span className="ml-2">{getStatusText()}</span>
      {lastCheck && (
        <span className="ml-2 text-xs text-gray-400">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
      <Button 
        onClick={checkApiStatus} 
        variant="ghost" 
        size="sm" 
        className="ml-2 h-6 px-2"
      >
        새로고침
      </Button>
    </div>
  );
}
