import { createClient } from '@/lib/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

export const revalidate = 60; // ISR кешування

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;
  const t = await getTranslations('Catalog');
  const locale = (await getLocale()) as 'en' | 'ru';
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', projectId)
    .eq('status', 'active')
    .single();

  if (error || !project) {
    notFound();
  }

  const localizedTitle = typeof project.title === 'object' ? project.title[locale] : project.title;
  const localizedDesc = typeof project.description_html === 'object' ? project.description_html[locale] : project.description_html;
  const techStack = project.tech_stack || [];
  const gallery = project.gallery || []; // Тільки додаткові фото для каруселі

  return (
    <div className="container py-12 md:py-16 mx-auto px-4 max-w-4xl">
      
      {/* Кнопка "Назад" */}
      <Button variant="ghost" asChild className="mb-6 -ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground">
        <Link href="/portfolio" className="flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t('backToPortfolio')}
        </Link>
      </Button>

      {/* Заголовок та Стек технологій */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          {localizedTitle}
        </h1>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Головна обкладинка (Окремо, велика) */}
      {project.cover_image && (
        <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-12 shadow-lg border bg-muted">
          <Image
            src={project.cover_image}
            alt={localizedTitle || 'Cover'}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Карусель Галереї (Тільки якщо є додаткові фото) */}
      {gallery.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold tracking-tight">
              {t('galleryTitle')}
            </h3>
          </div>
          
          <Carousel className="w-full relative group">
            <CarouselContent className="-ml-4">
              {gallery.map((imgUrl: string, idx: number) => (
                // basis-full на мобільному (1 фото), md:basis-1/2 на комп'ютері (2 фото поруч)
                <CarouselItem key={idx} className="pl-4 md:basis-1/2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="relative aspect-video rounded-xl overflow-hidden border shadow-sm group/slide bg-muted cursor-pointer">
                        <Image
                          src={imgUrl}
                          alt={`Gallery image ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover/slide:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/slide:opacity-100 transition-opacity flex items-center justify-center">
                          <Maximize2 className="w-8 h-8 text-white p-1.5 bg-black/50 rounded-full" />
                        </div>
                      </div>
                    </DialogTrigger>
                    
                    <DialogContent className="max-w-[95vw] max-h-[90vh] p-1 bg-transparent border-none overflow-hidden">
                      <div className="relative w-full h-[85vh]">
                        <Image
                          src={imgUrl}
                          alt={`Fullscreen gallery image ${idx + 1}`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </DialogContent>
                  </Dialog>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {gallery.length > 2 && (
              <>
                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {/* Текст опису (Знизу) */}
      {localizedDesc && (
        <div className="pt-8 border-t">
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: localizedDesc }}
          />
        </div>
      )}
    </div>
  );
}