import { createClient } from '@/lib/supabase/server';
import { AgentForm } from '../../components/agent-form';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server'; // Додаємо імпорт

export default async function EditAgentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const agentId = resolvedParams.id;
  const supabase = await createClient();
  const t = await getTranslations('Admin'); // Ініціалізуємо переклади

  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single();

  if (error || !agent) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('editAgentTitle')}</h1>
        <p className="text-muted-foreground">{t('editAgentDesc')}</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <AgentForm initialData={agent} />
      </div>
    </div>
  );
}