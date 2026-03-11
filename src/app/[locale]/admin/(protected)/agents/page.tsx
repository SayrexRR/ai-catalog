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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { DeleteAgentButton } from './components/delete-button';

export default async function AdminAgentsPage() {
  const t = await getTranslations('Admin');
  const locale = await getLocale() as 'en' | 'ru';
  const supabase = await createClient();

  // Отримуємо всіх агентів
  const { data: agents, error } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Помилка завантаження агентів: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('agentsTitle')}</h1>
          <p className="text-muted-foreground">{t('agentsDescription')}</p>
        </div>
        
        <Button asChild className="gap-2">
          <Link href="/admin/agents/new">
            <Plus className="w-4 h-4" />
            {t('addAgent')}
          </Link>
        </Button>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableTitle')}</TableHead>
              <TableHead>{t('tablePrice')}</TableHead>
              <TableHead>{t('tableStatus')}</TableHead>
              <TableHead className="text-right">{t('tableActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {agents && agents.length > 0 ? (
              agents.map((agent) => {
                // Витягуємо назву для поточної мови адмінки
                const localizedTitle = typeof agent.title === 'object' ? agent.title[locale] : agent.title;

                return (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">
                      {localizedTitle || 'Без назви'}
                    </TableCell>
                    <TableCell>${agent.price}</TableCell>
                    <TableCell>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status === 'active' ? t('statusActive') : t('statusDraft')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Посилання на сторінку редагування, яку ми щойно створили */}
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/admin/agents/${agent.id}/edit`}>
                            <Pencil className="w-4 h-4 text-muted-foreground" />
                          </Link>
                        </Button>
                        
                        {/* Наша нова кнопка видалення */}
                        <DeleteAgentButton id={agent.id} />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Агентов не найдено. Добавте первого агента, нажавши кнопку &quot;Добавить агента&quot;.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}