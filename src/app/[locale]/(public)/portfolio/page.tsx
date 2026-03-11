import { createClient } from '@/lib/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

export const revalidate = 60; // Оновлювати кеш кожні 60 секунд (ISR)

export default async function PortfolioPage() {
  const t = await getTranslations('Catalog');
  const locale = await getLocale() as 'en' | 'ru';
  const supabase = await createClient();

  // Отримуємо тільки активні проєкти
  const { data: projects } = await supabase
    .from('portfolio')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return (
    <div className="container py-12 md:py-20 mx-auto px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          {t('portfolioTitle')}
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('portfolioDesc')}
        </p>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground">{t('noProjectsPublic')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => {
            const localizedTitle = typeof project.title === 'object' ? project.title[locale] : project.title;
            const techStack = project.tech_stack || [];

            return (
              <Card key={project.id} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Обкладинка проєкту */}
                <div className="relative aspect-video w-full bg-muted border-b">
                  {project.cover_image ? (
                    <Image 
                      src={project.cover_image} 
                      alt={localizedTitle || 'Project Cover'} 
                      fill 
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <CardHeader>
                  <CardTitle className="text-2xl">{localizedTitle}</CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1">
                  {/* Виводимо стек технологій */}
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech: string, i: number) => (
                      <Badge key={i} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t">
                  <Button asChild className="w-full gap-2 group">
                    <Link href={`/portfolio/${project.id}`}>
                      {t('viewProject')}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}