/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

export async function createAgentAction(data: any) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('agents')
    .insert([
      {
        title: data.title, // Це об'єкт { en: "...", ru: "..." }
        description_md: data.description_md, // Це об'єкт { en: "...", ru: "..." }
        price: Number(data.price),
        icon_url: data.icon_url,
        status: data.status,
      }
    ]);

  if (error) {
    console.error('Error creating agent:', error);
    return { success: false, error: error.message };
  }

  // Очищаємо кеш сторінок, щоб нові дані одразу з'явилися на сайті
  revalidatePath('/admin/agents');
  revalidatePath('/agents'); 
  revalidatePath('/ru/agents'); 
  revalidatePath('/en/agents'); 

  return { success: true };
}

export async function updateAgentAction(id: number, data: any) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('agents')
    .update({
      title: data.title,
      description_md: data.description_md,
      price: Number(data.price),
      icon_url: data.icon_url,
      status: data.status,
    })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/agents');
  revalidatePath('/agents'); 
  revalidatePath('/ru/agents'); 
  revalidatePath('/en/agents'); 

  return { success: true };
}

export async function deleteAgentAction(id: number) {
  const supabaseAdmin = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabaseAdmin
    .from('agents')
    .delete()
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  revalidatePath('/admin/agents');
  revalidatePath('/agents'); 
  revalidatePath('/ru/agents'); 
  revalidatePath('/en/agents'); 

  return { success: true };
}