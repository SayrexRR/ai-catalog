"use client"

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAgentAction } from "@/actions/agents";
import { toast } from "sonner";
import { useTranslations } from "next-intl"; // Додаємо імпорт

export function DeleteAgentButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Admin'); // Ініціалізуємо переклади

  const handleDelete = () => {
    // Використовуємо перекладений текст для підтвердження
    if (window.confirm(t('deleteConfirm'))) {
      startTransition(async () => {
        const result = await deleteAgentAction(id);
        if (result.success) {
          toast.success(t('deleteSuccess')); // Перекладений успіх
        } else {
          toast.error(t('deleteError')); // Перекладена помилка
        }
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="hover:text-destructive" 
      onClick={handleDelete}
      disabled={isPending}
      title={t('delete')} // Додаємо підказку при наведенні (ключ 'delete' у нас вже є)
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}