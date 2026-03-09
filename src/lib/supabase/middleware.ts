import { createServerClient } from '@supabase/ssr';
import { type NextRequest, NextResponse } from 'next/server';

export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Оновлюємо кукі в реквесті (щоб наступні перевірки бачили нові значення)
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Оновлюємо кукі в респонсі (щоб браузер зберіг їх)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Цей виклик автоматично оновить сесію, якщо токен застарів
  await supabase.auth.getUser();

  return response;
}