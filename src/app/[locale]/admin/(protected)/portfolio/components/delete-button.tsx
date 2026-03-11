"use client"

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deletePortfolioAction } from "@/actions/portfolio";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export function DeletePortfolioButton({ id }: { id: number }) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('Admin');

  const handleDelete = () => {
    // Багатомовне підтвердження
    if (window.confirm(t('projectDeleteConfirm'))) {
      startTransition(async () => {
        const result = await deletePortfolioAction(id);
        if (result.success) {
          toast.success(t('projectDeleteSuccess'));
        } else {
          toast.error(t('projectDeleteError'));
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
      title={t('delete')}
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}