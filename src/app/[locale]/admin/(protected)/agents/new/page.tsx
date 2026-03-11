import { getTranslations } from "next-intl/server";
import { AgentForm } from "../components/agent-form";

export default async function NewAgentPage() {
  const t = await getTranslations('Admin');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('addAgentTitle')}</h1>
        <p className="text-muted-foreground">{t('addAgentDesc')}</p>
      </div>
      
      <div className="bg-card border rounded-lg p-6">
        <AgentForm />
      </div>
    </div>
  );
}