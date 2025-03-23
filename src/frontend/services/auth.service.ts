import { supabase } from '../../backend/lib/supabase';
import type { Database } from '../../backend/types/database.types';

export interface User {
  id: string;
  email: string;
  username: string;
  active: boolean;
}

type UserRow = Database['public']['Tables']['users']['Row'];
type UserInsert = Database['public']['Tables']['users']['Insert'];

const mapUserFromDB = (user: UserRow): User => ({
  id: user.id,
  email: user.email,
  username: user.username,
  active: user.active,
});

export const authService = {
  async signUp(email: string, password: string, username: string): Promise<{ user: User | null }> {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    if (authData.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email!,
          username,
          active: true,
        })
        .select()
        .single();

      if (userError) throw userError;
      return { user: mapUserFromDB(userData) };
    }

    return { user: null };
  },

  async signIn(email: string, password: string): Promise<{ user: User | null }> {
    const { data: { user: authUser }, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (authUser) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select()
        .eq('id', authUser.id)
        .single();

      if (userError) throw userError;
      return { user: mapUserFromDB(userData) };
    }

    return { user: null };
  },

  async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return null;

    const { data: userData, error } = await supabase
      .from('users')
      .select()
      .eq('id', authUser.id)
      .single();

    if (error) throw error;
    return mapUserFromDB(userData);
  },

  async updateProfile(userId: string, updates: Partial<Omit<User, 'id'>>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return mapUserFromDB(data);
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data } = await supabase
          .from('users')
          .select()
          .eq('id', session.user.id)
          .single();
        
        callback(data ? mapUserFromDB(data) : null);
      } else {
        callback(null);
      }
    });
  },
}; 