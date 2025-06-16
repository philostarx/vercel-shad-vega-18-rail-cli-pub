/**
 * 언어 전환 컴포넌트
 * 작성자: ft.s.curs
 * 작성일: 2025년 1월 8일
 */

'use client';

import { useI18n } from '@/hooks/useI18n';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  const currentLanguage = languages.find(lang => lang.code === locale);

  return (
    <Select value={locale} onValueChange={setLocale}>
      <SelectTrigger className="w-[100px]">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span>{currentLanguage?.flag}</span>
          <span className="text-sm font-medium">{currentLanguage?.code.toUpperCase()}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            <div className="flex items-center gap-2">
              <span>{language.flag}</span>
              <span>{language.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
} 