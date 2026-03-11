"use client"

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl"; // Імпортуємо хук
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateLeadStatus } from "@/actions/leads";
import { toast } from "sonner";

interface StatusSelectProps {
  leadId: number;
  currentStatus: string;
  colorClass: string;
}

export function StatusSelect({ leadId, currentStatus, colorClass }: StatusSelectProps) {
  const t = useTranslations('Admin'); // Викликаємо хук з неймспейсом 'Admin'
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleStatusChange = async (newStatus: string) => {
    startTransition(async () => {
      const result = await updateLeadStatus(leadId, newStatus);
      if (result.success) {
        toast.success(t('statusUpdateSuccess')); // Локалізований успіх
        router.refresh(); 
      } else {
        toast.error(t('statusUpdateError')); // Локалізована помилка
      }
    });
  };

  return (
    <Select
      defaultValue={currentStatus}
      onValueChange={handleStatusChange}
      disabled={isPending}
    >
      <SelectTrigger className={`w-32.5 h-8 ml-auto border-none font-medium ${colorClass}`}>
        {/* Заглушка також локалізована, але SelectValue використовує вибраний SelectItem */}
        <SelectValue placeholder={t('statusPlaceholder')} />
      </SelectTrigger>
      <SelectContent>
        {/* Опції з перекладом */}
        <SelectItem value="new">{t('statusNew')}</SelectItem>
        <SelectItem value="contacted">{t('statusContacted')}</SelectItem>
        <SelectItem value="closed">{t('statusClosed')}</SelectItem>
      </SelectContent>
    </Select>
  );
}