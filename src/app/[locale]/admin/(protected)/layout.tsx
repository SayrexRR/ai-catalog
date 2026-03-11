import { createClient } from '@/lib/supabase/server';
import { redirect } from '@/i18n/routing';
import { getLocale } from 'next-intl/server';
import { AdminSidebar } from './components/admin-sidebar'; // Підключаємо наш компонент

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const locale = await getLocale();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect({ href: '/admin/login', locale });
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Використовуємо новий красивий сайдбар */}
      <AdminSidebar />
      
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}