'use client'

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginWithEmail } from '@/actions/auth';
import { toast } from 'sonner';

export default function LoginPage() {
  const t = useTranslations('Admin');
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await loginWithEmail(formData);
    setIsPending(false);

    if (result.error) {
      // Перекладаємо отриманий ключ помилки
      toast.error(t(result.error));
    } else {
      toast.success(t('loginSuccess'));
      router.push('/admin'); 
      router.refresh(); 
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">{t('emailLabel')}</label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                placeholder="admin@example.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">{t('passwordLabel')}</label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? t('loading') : t('loginButton')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}