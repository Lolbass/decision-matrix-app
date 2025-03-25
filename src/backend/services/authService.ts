import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

export interface User {
  id: string;
  email: string;
  username: string;
  active: boolean;
}

type UserRow = Database['public']['Tables']['users']['Row'];

const mapUserFromDB = (user: UserRow): User => ({
  id: user.id,
  email: user.email,
  username: user.username,
  active: user.active,
});

export const authService = {
  async signUp(email: string, username: string): Promise<{ user: User | null }> {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        email,
        username,
        active: true,
      })
      .select()
      .single();

    if (userError) throw userError;
    return { user: mapUserFromDB(userData) };
  },

  async signIn(email: string): Promise<{ user: User | null }> {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single();

    if (userError) throw userError;
    return { user: mapUserFromDB(userData) };
  },

  async signOut(): Promise<void> {
    // Since we're not using Supabase Auth, we don't need to do anything here
  },

  async getCurrentUser(): Promise<User | null> {
    // For now, we'll just return null since we're not maintaining a session
    return null;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    // Since we're not using Supabase Auth, we'll just return a dummy subscription
    return {
      data: {
        subscription: {
          unsubscribe: () => {},
        },
      },
    };
  },
}; 