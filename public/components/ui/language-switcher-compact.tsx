/**
 * 컴팩트 언어 전환 컴포넌트 (아이콘만)
 * 작성자: ft.s.curs
 * 작성일: 2025년 1월 8일
 */

'use client';

import { useI18n } from '@/hooks/useI18n';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function LanguageSwitcherCompact() {
  const { locale, setLocale } = useI18n();

  const currentLanguage = languages.find(lang => lang.code === locale);

  const toggleLanguage = () => {
    const nextLanguage = locale === 'en' ? 'ko' : 'en';
    setLocale(nextLanguage);
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className="h-9 w-9 p-0" 
      onClick={toggleLanguage}
      title={`Switch to ${locale === 'en' ? '한국어' : 'English'}`}
    >
      <span className="text-lg">{currentLanguage?.flag}</span>
    </Button>
  );
} 