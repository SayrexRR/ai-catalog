import { createClient } from '@/lib/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatusSelect } from './components/status-select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new': return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20';
    case 'contacted': return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
    case 'closed': return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
    default: return 'bg-gray-500/10 text-gray-500';
  }
};

export default async function AdminDashboard() {
  const t = await getTranslations('Admin');
  const locale = await getLocale(); 
  const supabase = await createClient();

  const { data: leads, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Помилка завантаження заявок.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboardTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboardDescription')}</p>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableDate')}</TableHead>
              <TableHead>{t('tableClient')}</TableHead>
              <TableHead>{t('tableContacts')}</TableHead>
              <TableHead>{t('tableService')}</TableHead>
              <TableHead>{t('tableComment')}</TableHead>
              <TableHead>{t('tableCountry')}</TableHead>
              <TableHead className="text-right">{t('tableStatus')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads && leads.length > 0 ? (
              leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {new Intl.DateTimeFormat(locale, { 
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    }).format(new Date(lead.created_at))}
                  </TableCell>
                  <TableCell>{lead.client_name}</TableCell>
                  <TableCell>{lead.contact_info}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {lead.selected_item || t('generalService')}
                    </Badge>
                  </TableCell>
                  
                  {/* ОНОВЛЕНИЙ БЛОК КОМЕНТАРЯ */}
                  <TableCell className="max-w-50">
                    {lead.comment ? (
                      lead.comment.length > 50 ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="text-left w-full truncate hover:underline text-muted-foreground transition-colors cursor-pointer">
                              {lead.comment}
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Повідомлення від {lead.client_name}</DialogTitle>
                            </DialogHeader>
                            {/* whitespace-pre-wrap зберігає абзаци клієнта */}
                            <div className="mt-4 p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
                              {lead.comment}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ) : (
                        <span className="truncate">{lead.comment}</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>

                  <TableCell>{lead.client_country || 'Unknown'}</TableCell>
                  <TableCell className="text-right">
                    <StatusSelect 
                      leadId={lead.id} 
                      currentStatus={lead.status || 'new'} 
                      colorClass={getStatusColor(lead.status || 'new')}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  {t('noLeads')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}