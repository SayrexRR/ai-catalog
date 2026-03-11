'use server'

import { createClient } from '@/lib/supabase/server';

export async function loginWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    // Повертаємо ключ перекладу
    return { error: 'errorMissingFields' }; 
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Повертаємо ключ перекладу
    return { error: 'errorInvalidCredentials' };
  }

  return { success: true };
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}