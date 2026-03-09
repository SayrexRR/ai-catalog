import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

const handleI18nRouting = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Формуємо відповідь з урахуванням локалі (next-intl)
  const response = handleI18nRouting(request);

  // 2. Пропускаємо цю відповідь через Supabase для оновлення сесії
  return await updateSession(request, response);
}

export const config = {
  matcher: ['/', '/(en|ru)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};