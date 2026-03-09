"use client"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { toast } from "sonner" // Новий імпорт Sonner
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { submitLead } from "@/actions/leads"

const formSchema = z.object({
  client_name: z.string().min(2, { message: "Name is too short" }),
  contact_info: z.string().min(5, { message: "Please provide valid contact info" }),
  comment: z.string().optional(),
})

interface LeadFormProps {
  trigger?: React.ReactNode;
  selectedItem?: string;
}

export function LeadForm({ trigger, selectedItem }: LeadFormProps) {
  const t = useTranslations("LeadForm")
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_name: "",
      contact_info: "",
      comment: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsPending(true)
    
    const result = await submitLead({
      ...values,
      selected_item: selectedItem || "General Inquiry",
    })

    setIsPending(false)

    if (result.success) {
      // Sonner у дії!
      toast.success(t("success")) 
      form.reset()
      setIsOpen(false)
    } else {
      // Sonner для помилок
      toast.error(t("error")) 
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>{t("submit")}</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contact_info"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("contact")}</FormLabel>
                  <FormControl>
                    <Input placeholder="@username or email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("message")}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="..." 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t("sending") : t("submit")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}