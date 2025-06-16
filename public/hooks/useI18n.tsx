/**
 * 국제화 훅
 * 작성자: ft.s.curs
 * 작성일: 2025년 1월 8일
 */

'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, DEFAULT_LOCALE, getFormatters, Translations } from '@/lib/i18n';

interface I18nContextType {
  locale: string;
  setLocale: (locale: string) => void;
  t: Translations;
  formatters: ReturnType<typeof getFormatters>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE);

  // 로컬 스토리지에서 언어 설정 불러오기
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('locale') || DEFAULT_LOCALE;
      setLocaleState(savedLocale);
    }
  }, []);

  // 언어 변경 함수
  const setLocale = (newLocale: string) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  // 현재 언어의 번역 텍스트
  const t = translations[locale] || translations[DEFAULT_LOCALE];

  // 현재 언어의 포맷터
  const formatters = getFormatters(locale);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, formatters }}>
      {children}
    </I18nContext.Provider>
  );
}

// 국제화 훅
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// 번역 텍스트만 필요한 경우
export function useTranslation() {
  const { t } = useI18n();
  return t;
}

// 포맷터만 필요한 경우
export function useFormatters() {
  const { formatters } = useI18n();
  return formatters;
} 