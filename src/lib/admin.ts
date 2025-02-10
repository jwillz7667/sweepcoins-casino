import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function promoteToAdmin(email: string) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ is_admin: true })
      .eq('email', email);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return { success: false, error };
  }
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.is_admin || false;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
} 