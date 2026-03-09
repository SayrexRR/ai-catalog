import { createClient } from "@/lib/supabase/server";
import { getTranslations, getLocale } from "next-intl/server";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { SearchBar } from "@/components/shared/search-bar"; // Імпортуємо наш пошук
import { LeadForm } from "@/components/forms/lead-form";

// Імітація даних з Supabase, де title і description_md - це JSONB
const mockAgents = [
  {
    id: "mock-1",
    title: { en: "Customer Support AI", ru: "ИИ Поддержки Клиентов" },
    description_md: {
      en: "A 24/7 support bot that handles up to 80% of routine customer questions.",
      ru: "Круглосуточный бот поддержки, который обрабатывает до 80% рутинных вопросов клиентов.",
    },
    price: "499",
    status: "active",
  },
  {
    id: "mock-2",
    title: { en: "Data Analytics Agent", ru: "Агент Аналитики Данных" },
    description_md: {
      en: "An AI agent that aggregates data from your CRMs and generates reports weekly.",
      ru: "ИИ-агент, который собирает данные из ваших CRM и формирует отчеты каждую неделю.",
    },
    price: "799",
    status: "active",
  },
];

export default async function AgentsCatalog({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>; // У Next.js 15 searchParams - це проміс
}) {
  const supabase = await createClient();
  const tNav = await getTranslations("Navigation");
  const tCatalog = await getTranslations("Catalog");

  // Отримуємо поточну мову (en або ru) на сервері
  const locale = (await getLocale()) as "en" | "ru";

  const resolvedParams = await searchParams;
  const searchQuery = resolvedParams.q?.toLowerCase() || "";

  // Спробуємо отримати дані з БД (поки що закоментовано, бо у нас mock-дані)
  // const { data: dbAgents, error } = await supabase.from('agents').select('*').eq('status', 'active');
  const dbAgents = null;

  // Використовуємо БД або тестові дані
  const rawAgents = dbAgents ? dbAgents : mockAgents;

  // Фільтруємо за пошуковим запитом (пошук відбувається по поточній мові)
  const filteredAgents = rawAgents.filter((agent) => {
    if (!searchQuery) return true;

    // Витягуємо текст для поточної мови з об'єкта JSONB
    const title =
      typeof agent.title === "object" ? agent.title[locale] : agent.title;
    const desc =
      typeof agent.description_md === "object"
        ? agent.description_md[locale]
        : agent.description_md;

    return (
      title?.toLowerCase().includes(searchQuery) ||
      desc?.toLowerCase().includes(searchQuery)
    );
  });

  return (
    <div className="container mx-auto py-12 px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{tNav("agents")}</h1>
        <SearchBar /> {/* Вставляємо поле пошуку */}
      </div>

      {filteredAgents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => {
            // Отримуємо локалізовані значення для рендеру
            const localizedTitle =
              typeof agent.title === "object"
                ? agent.title[locale]
                : agent.title;
            const localizedDesc =
              typeof agent.description_md === "object"
                ? agent.description_md[locale]
                : agent.description_md;

            return (
              <Card
                key={agent.id}
                className="flex flex-col h-full bg-card/60 backdrop-blur border-border hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-xl">{localizedTitle}</CardTitle>
                    <span className="font-bold text-lg text-primary whitespace-nowrap">
                      ${agent.price}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="text-muted-foreground line-clamp-3">
                    {localizedDesc || tCatalog("noDescription")}
                  </p>
                </CardContent>

                <CardFooter className="pt-4 border-t w-full">
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {/* Кнопка "Детальніше" */}
                    <Button asChild variant="outline" className="w-full px-2">
                      <Link href={`/agents/${agent.id}`}>
                        {tCatalog("viewDetails")}
                      </Link>
                    </Button>

                    {/* Кнопка швидкого замовлення */}
                    <LeadForm
                      selectedItem={localizedTitle}
                      trigger={
                        <Button className="w-full px-2">
                          {tCatalog("orderNow")}
                        </Button>
                      }
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground border rounded-lg bg-muted/10">
          <p>{tCatalog("noAgentsFound")}</p>
        </div>
      )}
    </div>
  );
}
