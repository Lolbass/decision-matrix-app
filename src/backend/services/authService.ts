import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const authService = {
  async signUp(email: string, username: string, password: string) {
    try {
      // First, sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned from signup');

      // Now that we're authenticated, create the user record
      const { error: userError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username,
            active: true,
          },
        ])
        .single();

      if (userError) {
        console.error('Error creating user record:', userError);
        // If we fail to create the user record, sign out and clean up
        await supabase.auth.signOut();
        throw userError;
      }

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Check if user exists in the users table
      if (authData.user) {
        const { data: existingUser, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError && userError.code !== 'PGRST116') { // Ignore "not found" errors
          console.error('Error checking user record:', userError);
        }

        // If user doesn't exist in the users table, create the record
        if (!existingUser) {
          const { error: createError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: authData.user.email,
                username: email.split('@')[0], // Use part of email as username
                active: true,
              },
            ])
            .single();

          if (createError) {
            console.error('Error creating user record:', createError);
          }
        }
      }

      return authData;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });
  },
}; 