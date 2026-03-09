"use client"

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    // Перемикаємо між en та ru
    const nextLocale = locale === 'en' ? 'ru' : 'en';
    // router.replace з нашого конфігу автоматично підставить правильний префікс в URL
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <Button variant="outline" size="sm" onClick={toggleLocale} className="gap-2">
      <Languages className="h-4 w-4" />
      <span>{locale === 'en' ? 'RU' : 'EN'}</span>
    </Button>
  );
}