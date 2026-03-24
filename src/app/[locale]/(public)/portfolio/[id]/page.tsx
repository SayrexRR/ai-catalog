import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { PortfolioGallery } from "@/components/ui/portfolio-gallery";

export const revalidate = 60;

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;
  const t = await getTranslations("Catalog");
  const locale = (await getLocale()) as "en" | "ru";
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("portfolio")
    .select("*")
    .eq("id", projectId)
    .eq("status", "active")
    .single();

  if (error || !project) {
    notFound();
  }

  const localizedTitle =
    typeof project.title === "object" ? project.title[locale] : project.title;
  let localizedDesc =
    typeof project.description_html === "object"
      ? project.description_html[locale]
      : project.description_html;

  // Автоматично лікуємо текст від нерозривних пробілів перед виводом
  if (localizedDesc) {
    localizedDesc = localizedDesc.replaceAll("&nbsp;", " ");
  }
  const techStack = project.tech_stack || [];
  const gallery = project.gallery || [];

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16 max-w-4xl">
      {/* Кнопка "Назад" */}
      <Button
        variant="ghost"
        asChild
        className="mb-6 -ml-2 sm:-ml-4 hover:bg-transparent text-muted-foreground hover:text-foreground"
      >
        <Link
          href="/portfolio"
          className="flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToPortfolio")}
        </Link>
      </Button>

      {/* Заголовок та Стек */}
      <div className="mb-8 md:mb-10">
        {/* text-balance робить так, щоб багаторядкові заголовки виглядали симетрично */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-balance">
          {localizedTitle}
        </h1>
        {techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStack.map((tech: string, i: number) => (
              <Badge
                key={i}
                variant="secondary"
                className="text-xs sm:text-sm px-2.5 py-0.5"
              >
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Головна обкладинка */}
      {project.cover_image && (
        <div className="relative aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden mb-10 md:mb-14 shadow-md border bg-muted">
          <Image
            src={project.cover_image}
            alt={localizedTitle || "Cover"}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Карусель Галереї */}
      {gallery.length > 0 && (
        <PortfolioGallery gallery={gallery} title={t("galleryTitle")} />
      )}

      {/* Опис проєкту з ідеальною адаптивністю */}
      {localizedDesc && (
        <div className="pt-8 md:pt-10 border-t border-border/50">
          <div
            className="prose prose-sm sm:prose-base md:prose-lg dark:prose-invert max-w-none 
                       prose-headings:text-balance prose-a:text-primary 
                       prose-img:rounded-xl sm:prose-img:rounded-2xl prose-img:shadow-sm 
                       prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:overflow-x-auto
                       whitespace-normal wrap-break-word"
            dangerouslySetInnerHTML={{ __html: localizedDesc }}
          />
        </div>
      )}
    </div>
  );
}
