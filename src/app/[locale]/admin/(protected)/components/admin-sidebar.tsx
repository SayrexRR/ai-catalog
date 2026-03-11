"use client"

import { usePathname, useRouter, Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LayoutDashboard, Bot, Briefcase, LogOut } from 'lucide-react';
import { logOut } from '@/actions/auth';
import { cn } from '@/lib/utils'; // Стандартна утиліта shadcn для склеювання класів

export function AdminSidebar() {
  const t = useTranslations('Admin');
  const pathname = usePathname();
  const router = useRouter();

  // Масив наших посилань з іконками
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t('navDashboard'), exact: true },
    { href: '/admin/agents', icon: Bot, label: t('navAgents') },
    { href: '/admin/portfolio', icon: Briefcase, label: t('navPortfolio') },
  ];

  const handleLogout = async () => {
    await logOut();
    router.push('/admin/login');
  };

  return (
    <aside className="w-64 bg-card border-r hidden md:flex flex-col p-4 min-h-screen sticky top-0 shadow-sm">
      <div className="p-2 mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t('sidebarTitle')}</h2>
      </div>
      
      <nav className="flex-1 space-y-1.5">
        {navItems.map((item) => {
          // Перевіряємо, чи ми зараз на цій сторінці
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary" // Стиль активної кнопки
                  : "text-muted-foreground hover:bg-muted hover:text-foreground" // Стиль звичайної кнопки
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Кнопка виходу в самому низу */}
      <div className="mt-auto border-t pt-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          {t('navLogout')}
        </button>
      </div>
    </aside>
  );
}