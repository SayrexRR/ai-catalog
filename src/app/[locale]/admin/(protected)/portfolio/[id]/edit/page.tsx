import { createClient } from '@/lib/supabase/server';
import { PortfolioForm } from '../../components/portfolio-form';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';

export default async function EditPortfolioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;
  const supabase = await createClient();
  const t = await getTranslations('Admin');

  // Отримуємо проєкт за його ID
  const { data: project, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('id', projectId)
    .single();

  // Якщо проєкт не знайдено — показуємо стандартну сторінку 404
  if (error || !project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('editProjectTitle')}</h1>
        <p className="text-muted-foreground">{t('editProjectDesc')}</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        {/* Передаємо знайдені дані у нашу форму */}
        <PortfolioForm initialData={project} />
      </div>
    </div>
  );
}