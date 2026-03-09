import createNextIntlPlugin from 'next-intl/plugin';

// Вказуємо точний шлях до нашого файлу конфігурації запитів
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* Тут будуть інші твої налаштування */
  
  // Одразу додамо налаштування для зображень зі Supabase Storage, 
  // які нам знадобляться для портфоліо
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};

// Обгортаємо базовий конфіг плагіном next-intl
export default withNextIntl(nextConfig);