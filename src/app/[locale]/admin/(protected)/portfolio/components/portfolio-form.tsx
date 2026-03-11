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
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { createPortfolioAction, updatePortfolioAction, uploadImageAction } from "@/actions/portfolio";
import Image from "next/image";
import { UploadCloud, X, Plus } from "lucide-react";

interface PortfolioFormProps {
  initialData?: any;
}

export function PortfolioForm({ initialData }: PortfolioFormProps) {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isGalleryUploading, setIsGalleryUploading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || { en: "", ru: "" });
  const [desc, setDesc] = useState(initialData?.description_html || { en: "", ru: "" });
  
  const [techStack, setTechStack] = useState(
    initialData?.tech_stack ? initialData.tech_stack.join(', ') : ""
  );
  
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "");
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [status, setStatus] = useState(initialData?.status || "active");

  // Завантаження головного фото
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImageAction(formData);
    
    if (result.success && result.url) {
      setCoverImage(result.url);
      toast.success(t('imageUploadSuccess'));
    } else {
      toast.error(t('imageUploadError'));
    }
    setIsUploading(false);
  };

  // Завантаження фотографій у галерею (можна виділити кілька файлів одразу)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsGalleryUploading(true);
    const newUrls: string[] = [];

    // Завантажуємо файли по черзі
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append('file', files[i]);
      const result = await uploadImageAction(formData);
      
      if (result.success && result.url) {
        newUrls.push(result.url);
      } else {
        toast.error(`${t('imageUploadError')}: ${files[i].name}`);
      }
    }

    if (newUrls.length > 0) {
      setGallery((prev) => [...prev, ...newUrls]);
      toast.success(t('imageUploadSuccess'));
    }
    
    setIsGalleryUploading(false);
  };

  // Видалення картинки з галереї
  const removeGalleryImage = (indexToRemove: number) => {
    setGallery((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    const stackArray = techStack.split(',').map((item: string) => item.trim()).filter(Boolean);

    const payload = {
      title,
      description_html: desc,
      tech_stack: stackArray,
      cover_image: coverImage,
      gallery, // Тепер масив галереї йде в базу
      status,
    };

    const result = initialData?.id 
      ? await updatePortfolioAction(initialData.id, payload)
      : await createPortfolioAction(payload);

    setIsPending(false);

    if (result.success) {
      toast.success(initialData?.id ? t('projectUpdateSuccess') : t('projectSaveSuccess'));
      router.push('/admin/portfolio');
      router.refresh();
    } else {
      toast.error(t('saveError'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Ліва колонка (Тексти та Галерея) - 2/3 ширини */}
        <div className="md:col-span-2 space-y-8">
          <Tabs defaultValue="en" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ru">Русский</TabsTrigger>
            </TabsList>

            {['en', 'ru'].map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('projectNameLabel')} ({lang.toUpperCase()})</label>
                  <Input 
                    required 
                    value={title[lang as keyof typeof title]} 
                    onChange={e => setTitle({...title, [lang]: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t('projectDescLabel')} ({lang.toUpperCase()})</label>
                  <MarkdownEditor 
                    value={desc[lang as keyof typeof desc]} 
                    onChange={(val) => setDesc({...desc, [lang]: val})} 
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Секція Галереї */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">{t('galleryLabel')}</label>
              {isGalleryUploading && <span className="text-sm text-muted-foreground animate-pulse">{t('uploadingGallery')}</span>}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-md overflow-hidden group border bg-muted">
                  <Image src={url} alt={`Gallery ${idx}`} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="icon" 
                      className="w-8 h-8" 
                      onClick={() => removeGalleryImage(idx)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Кнопка додавання в галерею */}
              <label className="cursor-pointer flex flex-col items-center justify-center aspect-video border-2 border-dashed rounded-md hover:bg-muted/50 transition-colors">
                <Plus className="w-8 h-8 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground px-2 text-center">Додати</span>
                {/* Атрибут multiple дозволяє виділити відразу кілька файлів */}
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  className="hidden" 
                  onChange={handleGalleryUpload} 
                  disabled={isGalleryUploading} 
                />
              </label>
            </div>
          </div>
        </div>

        {/* Права колонка (Налаштування та Обкладинка) - 1/3 ширини */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t('coverImageLabel')}</label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/50 transition-colors">
              {coverImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md group">
                  <Image src={coverImage} alt="Cover" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button type="button" variant="destructive" size="icon" onClick={() => setCoverImage("")}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-6">
                  <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground text-balance">
                    {isUploading ? t('uploading') : t('clickToUpload')}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} disabled={isUploading} />
                </label>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('techStackLabel')}</label>
            <Input 
              placeholder="React, n8n, Tailwind..." 
              value={techStack} 
              onChange={e => setTechStack(e.target.value)} 
            />
            <p className="text-xs text-muted-foreground">{t('commaSeparated')}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t('formStatus')}</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t('statusActive')}</SelectItem>
                <SelectItem value="draft">{t('statusDraft')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-4 mt-8">
        <Button type="button" variant="outline" onClick={() => router.push('/admin/portfolio')} disabled={isPending}>
          {t('btnCancel')}
        </Button>
        <Button type="submit" disabled={isPending || isUploading || isGalleryUploading}>
          {isPending ? t('loading') : t('btnSave')}
        </Button>
      </div>
    </form>
  );
}