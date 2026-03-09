"use server"

import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Ініціалізуємо Resend
const resend = new Resend(process.env.RESEND_API_KEY);

// Тип для нашої форми (щоб було все строго)
export type LeadData = {
  client_name: string;
  contact_info: string;
  selected_item?: string;
  comment?: string;
};

export async function submitLead(formData: LeadData) {
  try {
    // 1. Отримуємо країну клієнта за допомогою Vercel
    const headersList = await headers();
    const country = headersList.get('x-vercel-ip-country') || 'Unknown';

    // 2. Ініціалізуємо Supabase
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 3. Зберігаємо дані в таблицю leads
    const { data: leadData, error: supabaseError } = await supabaseAdmin
      .from('leads')
      .insert([
        {
          client_name: formData.client_name,
          contact_info: formData.contact_info,
          selected_item: formData.selected_item || 'General Request',
          comment: formData.comment || '',
          client_country: country,
          // status за замовчуванням 'new' у БД
        }
      ])
      .select()
      .single();

    if (supabaseError) {
      console.error('Supabase Error:', supabaseError);
      return { success: false, error: 'Failed to save lead in database' };
    }

    // 4. Запускаємо відправку сповіщень ПАРАЛЕЛЬНО, щоб не блокувати відповідь клієнту
    // Це робиться за допомогою Promise.allSettled, щоб помилка в одному не поклала все
    const notificationPromises = [];

    // 4.1. Telegram сповіщення
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
      const tgMessage = `🚀 <b>Новий лід!</b>\n\n` +
        `👤 Ім'я: ${formData.client_name}\n` +
        `📞 Контакти: ${formData.contact_info}\n` +
        `📦 Послуга: ${formData.selected_item || 'General Request'}\n` +
        `🌍 Країна: ${country}\n` +
        `📝 Коментар: ${formData.comment || '-'}`;

      const tgPromise = fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: tgMessage,
          parse_mode: 'HTML'
        })
      });
      notificationPromises.push(tgPromise);
    }

    // 4.2. Email сповіщення через Resend
    if (process.env.RESEND_API_KEY) {
      const emailPromise = resend.emails.send({
        // Зміни email відправника на той, що підтверджений у твоєму акаунті Resend
        from: 'AI Catalog <onboarding@resend.dev>', 
        // Зміни email отримувача на свій
        to: 'your-email@example.com', 
        subject: `New Lead: ${formData.client_name}`,
        html: `
          <h2>New Lead from AI Catalog</h2>
          <p><strong>Name:</strong> ${formData.client_name}</p>
          <p><strong>Contact:</strong> ${formData.contact_info}</p>
          <p><strong>Service:</strong> ${formData.selected_item || 'General Request'}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Comment:</strong> ${formData.comment || '-'}</p>
        `
      });
      notificationPromises.push(emailPromise);
    }

    // Виконуємо сповіщення
    await Promise.allSettled(notificationPromises);

    // 5. Повертаємо успішний результат
    return { success: true, leadId: leadData.id };

  } catch (error) {
    console.error('Server Action Error:', error);
    return { success: false, error: 'Internal server error' };
  }
}