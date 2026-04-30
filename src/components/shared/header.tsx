"use client";

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ThemeToggle } from './theme-toggle';
import { LangSwitcher } from './lang-switcher';
import { Menu, Bot, Briefcase, Video, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

export function Header() {
  // Використовуємо простір імен 'Navigation' з ваших JSON файлів
  const t = useTranslations('Navigation');
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        
        {/* Логотип */}
        <div className="flex flex-1 items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl tracking-tight">
              AI<span className="text-primary"> Agents</span>
            </span>
          </Link>
        </div>

        {/* Десктопна навігація */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/agents" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('agents')}
          </Link>
          <Link href="/portfolio" className="transition-colors hover:text-foreground/80 text-foreground/60">
            {t('portfolio')}
          </Link>
        </nav>

        {/* Права частина: Перемикачі та Мобільне меню */}
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <LangSwitcher />
          <ThemeToggle />

          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              
              <SheetContent side="right" className="w-[300px] p-0 flex flex-col border-l">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                
                {/* Верхня частина меню з логотипом */}
                <div className="p-6 border-b bg-muted/20">
                  <Link href="/" onClick={() => setOpen(false)} className="flex items-center space-x-2">
                    <span className="font-bold text-xl tracking-tight">
                      AI<span className="text-primary"> Agents</span>
                    </span>
                  </Link>
                </div>

                {/* Список посилань з іконками та відступами */}
                <nav className="flex-1 px-3 py-6 flex flex-col space-y-2">
                  <Link 
                    href="/agents" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all hover:bg-primary/5 active:scale-95 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Bot size={22} />
                    </div>
                    <span className="font-semibold text-lg">{t('agents')}</span>
                  </Link>

                  <Link 
                    href="/portfolio" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl transition-all hover:bg-primary/5 active:scale-95 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Briefcase size={22} />
                    </div>
                    <span className="font-semibold text-lg">{t('portfolio')}</span>
                  </Link>

                  {/* Слот для майбутньої послуги: Відеомонтаж */}
                  <div className="flex items-center gap-4 px-4 py-4 rounded-2xl opacity-50 grayscale">
                    <div className="w-11 h-11 rounded-xl bg-muted flex items-center justify-center">
                      <Video size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-lg">
                        {/* Тут можна додати переклад у майбутньому */}
                        Video Editing
                      </span>
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Coming Soon
                      </span>
                    </div>
                  </div>
                </nav>

                {/* Нижня частина з кнопкою зв'язку */}
                <div className="p-6 mt-auto border-t bg-muted/10">
                  <Button className="w-full h-12 gap-3 rounded-xl shadow-lg shadow-primary/20" asChild>
                    <Link href="#contact" onClick={() => setOpen(false)}>
                      <Send size={18} />
                      {/* Використовуйте ключ 'contact' або схожий */}
                      {t('contact') || 'Contact'}
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}