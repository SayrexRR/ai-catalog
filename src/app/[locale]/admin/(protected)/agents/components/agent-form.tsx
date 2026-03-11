/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { createAgentAction, updateAgentAction } from "@/actions/agents";
import { MarkdownEditor } from "@/components/ui/markdown-editor"; // Твій новий редактор

// Додаємо інтерфейс для початкових даних
interface AgentFormProps {
  initialData?: any;
}

export function AgentForm({ initialData }: AgentFormProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  // Якщо initialData є, підставляємо їх, інакше - порожні значення
  const [title, setTitle] = useState(initialData?.title || { en: "", ru: "" });
  const [desc, setDesc] = useState(initialData?.description_md || { en: "", ru: "" });
  const [price, setPrice] = useState(initialData?.price?.toString() || "");
  const [iconUrl, setIconUrl] = useState(initialData?.icon_url || "");
  const [status, setStatus] = useState(initialData?.status || "active");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const payload = {
      title,
      description_md: desc,
      price,
      icon_url: iconUrl,
      status,
    };

    let result;
    // Визначаємо: це створення чи оновлення?
    if (initialData?.id) {
      result = await updateAgentAction(initialData.id, payload);
    } else {
      result = await createAgentAction(payload);
    }

    setIsPending(false);

    if (result.success) {
      toast.success(initialData?.id ? t('updateSuccess') : t('saveSuccess'));
      router.push('/admin/agents');
      router.refresh();
    } else {
      toast.error(t('saveError'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <Tabs defaultValue="en" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="en">{t("tabEn")}</TabsTrigger>
          <TabsTrigger value="ru">{t("tabRu")}</TabsTrigger>
        </TabsList>

        {/* Англійська вкладка */}
        <TabsContent value="en" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("formName")} (EN)</label>
            <Input
              required
              value={title.en}
              onChange={(e) => setTitle({ ...title, en: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("formDesc")} (EN)</label>
            <MarkdownEditor
              value={desc.en}
              onChange={(val) => setDesc({ ...desc, en: val })}
            />
          </div>
        </TabsContent>

        {/* Російська вкладка */}
        <TabsContent value="ru" className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("formName")} (RU)</label>
            <Input
              required
              value={title.ru}
              onChange={(e) => setTitle({ ...title, ru: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("formDesc")} (RU)</label>
            <MarkdownEditor
              value={desc.ru}
              onChange={(val) => setDesc({ ...desc, ru: val })}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("formPrice")}</label>
          <Input
            type="number"
            required
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("formIcon")}</label>
          <Input
            placeholder="/icons/bot.svg"
            value={iconUrl}
            onChange={(e) => setIconUrl(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("formStatus")}</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("statusActive")}</SelectItem>
              <SelectItem value="draft">{t("statusDraft")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/agents")}
          disabled={isPending}
        >
          {t("btnCancel")}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t("loading") : t("btnSave")}
        </Button>
      </div>
    </form>
  );
}
