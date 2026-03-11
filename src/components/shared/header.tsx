import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ThemeToggle } from './theme-toggle';
import { LangSwitcher } from './lang-switcher';

export function Header() {
  const t = useTranslations('Navigation');

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        
        {/* Ліва частина: Логотип (займає 1 фракцію і вирівнюється ліворуч) */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">
              AI<span className="text-primary"> Agents</span>
            </span>
          </Link>
        </div>

        {/* Центральна частина: Навігація */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/agents" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('agents')}
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('portfolio')}
          </Link>
        </nav>

        {/* Права частина: Перемикачі (займає 1 фракцію і вирівнюється праворуч) */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <LangSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}