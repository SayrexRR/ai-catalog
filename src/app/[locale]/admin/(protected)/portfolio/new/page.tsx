import { getTranslations } from "next-intl/server";
import { PortfolioForm } from "../components/portfolio-form";

export default async function NewPortfolioPage() {
  const t = await getTranslations('Admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addProject')}</h1>
        <p className="text-muted-foreground">{t('addProjectDesc')}</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <PortfolioForm />
      </div>
    </div>
  );
}