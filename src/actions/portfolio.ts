/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// 1. Функція для видалення проєкту
export async function deletePortfolioAction(id: number) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('portfolio')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/portfolio');
  revalidatePath('/portfolio'); 
  revalidatePath('/ru/portfolio'); 
  revalidatePath('/en/portfolio'); 

  return { success: true };
}

// 2. Універсальна функція для завантаження файлів у Supabase Storage
export async function uploadImageAction(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    return { success: false, error: 'Файл не знайдено' };
  }

  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Генеруємо унікальне ім'я файлу, щоб уникнути перезапису (наприклад: 123e4567.jpg)
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  // Завантажуємо файл у бакет 'portfolio-images'
  const { data, error } = await supabaseAdmin.storage
    .from('portfolio-images')
    .upload(fileName, file);

  if (error) {
    console.error('Помилка завантаження файлу:', error);
    return { success: false, error: error.message };
  }

  // Отримуємо публічне посилання на завантажену картинку
  const { data: publicUrlData } = supabaseAdmin.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);

  return { success: true, url: publicUrlData.publicUrl };
}

export async function createPortfolioAction(data: any) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('portfolio')
    .insert([{
      title: data.title,
      description_html: data.description_html,
      tech_stack: data.tech_stack,
      cover_image: data.cover_image,
      gallery: data.gallery,
      status: data.status,
    }]);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/portfolio');
  revalidatePath('/portfolio'); 
  return { success: true };
}

export async function updatePortfolioAction(id: number, data: any) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('portfolio')
    .update({
      title: data.title,
      description_html: data.description_html,
      tech_stack: data.tech_stack,
      cover_image: data.cover_image,
      gallery: data.gallery,
      status: data.status,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/portfolio');
  revalidatePath('/portfolio'); 
  return { success: true };
}