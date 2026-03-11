import { createClient } from '@/lib/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { DeletePortfolioButton } from './components/delete-button';

// Ми використаємо ту саму логіку для кнопки видалення, але трохи згодом створимо для неї компонент
// Поки що поставимо заглушку

export default async function AdminPortfolioPage() {
  const t = await getTranslations('Admin');
  const locale = await getLocale() as 'en' | 'ru';
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Помилка завантаження портфоліо: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('portfolioTitle')}</h1>
          <p className="text-muted-foreground">{t('portfolioDesc')}</p>
        </div>
        
        <Button asChild className="gap-2">
          <Link href="/admin/portfolio/new">
            <Plus className="w-4 h-4" />
            {t('addProject')}
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">Фото</TableHead>
              <TableHead>{t('tableProject')}</TableHead>
              <TableHead>{t('tableTechStack')}</TableHead>
              <TableHead>{t('tableStatus')}</TableHead>
              <TableHead className="text-right">{t('tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects && projects.length > 0 ? (
              projects.map((project) => {
                const localizedTitle = typeof project.title === 'object' ? project.title[locale] : project.title;
                const techStack = project.tech_stack || [];

                return (
                  <TableRow key={project.id}>
                    <TableCell>
                      {project.cover_image ? (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden border">
                          <Image src={project.cover_image} alt={localizedTitle || 'Cover'} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center border">
                          <ImageIcon className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {localizedTitle || 'Без назви'}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {techStack.map((tech: string, i: number) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                        {project.status === 'active' ? t('statusActive') : t('statusDraft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Робоче посилання на сторінку редагування */}
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/portfolio/${project.id}/edit`}>
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </Button>
                        
                        {/* Робоча кнопка видалення */}
                        <DeletePortfolioButton id={project.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                  {t('noProjects')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}