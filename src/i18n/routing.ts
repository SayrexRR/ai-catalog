import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Список підтримуваних мов
  locales: ['en', 'ru'],
  // Мова за замовчуванням
  defaultLocale: 'en'
});

// Експортуємо типізовані компоненти та хуки для використання по всьому проєкту
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);