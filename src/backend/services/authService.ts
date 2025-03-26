import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export const authService = {
  async signUp(email: string, username: string, password: string) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0], // Ensure username is set
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned from signup');

      // Manually create the user record instead of relying on the trigger
      const { error: userError } = await supabase
        .from('users')
        .upsert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username: username || email.split('@')[0],
            active: true,
          },
        ], { onConflict: 'id' });

      if (userError) {
        console.error('Error creating user record:', userError);
        throw new Error('Failed to create user record');
      }

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  },

  async signIn(email: string, password: string) {
    try {
      console.log('Attempting to sign in...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error('Sign in error:', authError);
        throw authError;
      }

      console.log('Sign in successful, checking session...');
      
      // Verify the session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.error('No session after sign in');
        throw new Error('Failed to create session');
      }

      console.log('Session verified:', session.user?.email);

      // Check if user exists in the users table
      if (authData.user) {
        console.log('Checking user record...');
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
          console.log('Creating user record...');
          const { error: createError } = await supabase
            .from('users')
            .upsert([
              {
                id: authData.user.id,
                email: authData.user.email,
                username: email.split('@')[0], // Use part of email as username
                active: true,
              },
            ], { onConflict: 'id' });

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