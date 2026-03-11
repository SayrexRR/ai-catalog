import { createClient } from '@/lib/supabase/server';
import { getTranslations, getLocale } from 'next-intl/server';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import { SearchBar } from '@/components/shared/search-bar';
import { LeadForm } from '@/components/forms/lead-form';

export default async function AgentsCatalog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const tNav = await getTranslations('Navigation');
  const tCatalog = await getTranslations('Catalog');
  
  const locale = await getLocale() as 'en' | 'ru'; 
  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || '';

  // 1. Отримуємо реальні дані з БД (тільки активні агенти)
  const { data: dbAgents, error } = await supabase
    .from('agents')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Помилка завантаження агентів з БД:', error);
  }

  // Якщо даних немає (або помилка), використовуємо порожній масив
  const rawAgents = dbAgents || [];

  // 2. Фільтруємо за пошуковим запитом по поточній мові
  const filteredAgents = rawAgents.filter((agent) => {
    if (!searchQuery) return true;
    
    // Витягуємо текст для поточної мови з JSONB об'єкта
    const title = typeof agent.title === 'object' ? agent.title[locale] : agent.title;
    const desc = typeof agent.description_md === 'object' ? agent.description_md[locale] : agent.description_md;

    return (
      title?.toLowerCase().includes(searchQuery) ||
      desc?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{tNav('agents')}</h1>
        <SearchBar />
      </div>
      
      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            // Отримуємо локалізовані значення для рендеру
            const localizedTitle = typeof agent.title === 'object' ? agent.title[locale] : agent.title;
            const localizedDesc = typeof agent.description_md === 'object' ? agent.description_md[locale] : agent.description_md;

            return (
              <Card key={agent.id} className="flex flex-col h-full bg-card/60 backdrop-blur border-border hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{localizedTitle}</CardTitle>
                    <span className="font-bold text-lg text-primary whitespace-nowrap">
                      ${agent.price}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  {/* Клас prose повертає крапочки та відступи для HTML-тегів */}
                  <div 
                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: localizedDesc || `<p>${tCatalog('noDescription')}</p>` 
                    }}
                  />
                </CardContent>
                
                <CardFooter className="pt-4 border-t w-full">
                  {/* Залишили тільки одну кнопку на всю ширину */}
                  <LeadForm 
                    selectedItem={localizedTitle} 
                    trigger={
                      <Button className="w-full text-md h-12">
                        {tCatalog('orderNow')} 
                      </Button>
                    } 
                  />
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        // Блок, який показується, якщо БД порожня або нічого не знайдено
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-muted/10">
          <p className="text-lg">{tCatalog('noAgentsFound')}</p>
        </div>
      )}
    </div>
  );
}