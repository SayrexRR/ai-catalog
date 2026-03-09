import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Github, Linkedin, Twitter } from 'lucide-react';

export function Footer() {
  const t = useTranslations('Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Логотип та копірайт */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg tracking-tight">
              AI<span className="text-primary">Agents</span>
            </span>
          </Link>
          <p className="text-sm text-muted-foreground">
            © {currentYear} AI Agents. {t('rights')}
          </p>
        </div>

        {/* Навігація в футері */}
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            {t('privacy')}
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {t('terms')}
          </Link>
        </nav>

        {/* Соціальні мережі (або посилання на фриланс профілі) */}
        <div className="flex items-center gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
            <Github className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
            <Twitter className="h-5 w-5" />
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

      </div>
    </footer>
  );
}