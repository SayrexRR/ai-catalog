/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ThemeProvider } from '@/components/shared/theme-provider';
import { Header } from '@/components/shared/header';
import '@/app/globals.css';
import { Footer } from '@/components/shared/footer';
import { Toaster } from '@/components/ui/sonner';

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>; // У Next.js 15 params є промісом
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            {/* Основний контент займає залишок екрану */}
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <Toaster position='top-right' richColors />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}