"use client"

import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { useTranslations } from 'next-intl';
import { useTransition, useState } from 'react';

export function SearchBar() {
  const t = useTranslations('Catalog');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    
    // Використовуємо useTransition, щоб не блокувати UI під час оновлення URL
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('q', term);
      } else {
        params.delete('q');
      }
      
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="relative w-full md:w-72">
      <Input
        type="search"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={(e) => handleSearch(e.target.value)}
        className="h-10 bg-muted/50 pl-4 pr-10"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}
    </div>
  );
}