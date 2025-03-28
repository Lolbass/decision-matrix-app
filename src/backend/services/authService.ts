import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Session validation helper
const validateSession = async (): Promise<boolean> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session validation error:', error.message);
      return false;
    }
    return !!session;
  } catch (err) {
    console.error('Error validating session:', err);
    return false;
  }
};

export const authService = {
  async signUp(email: string, username: string, password: string) {
    try {
      // Use email prefix as fallback username if none provided
      const finalUsername = username || email.split('@')[0];
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: finalUsername,
          },
          emailRedirectTo: window.location.origin, // Add redirect URL for email confirmation
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned from signup');

      // Create the user record in the users table
      const { error: userError } = await supabase
        .from('users')
        .upsert([
          {
            id: authData.user.id,
            email: authData.user.email,
            username: finalUsername,
            active: true,
          },
        ], { onConflict: 'id' });

      if (userError) {
        throw new Error(`Failed to create user record: ${userError.message}`);
      }

      // Check if email confirmation is required
      if (!authData.session) {
        return {
          ...authData,
          emailConfirmationRequired: true
        };
      }

      // Wait a moment for session establishment if we have a session
      await new Promise(resolve => setTimeout(resolve, 100));
      
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
      
      // Wait a moment for the session to be properly established
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Verify the session was created
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session) {
        throw new Error('Failed to create session');
      }

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
        // Use username from auth metadata if available, otherwise fallback to email prefix
        if (!existingUser) {
          const userData = authData.user.user_metadata as { username?: string };
          const username = userData.username || email.split('@')[0];
          
          const { error: createError } = await supabase
            .from('users')
            .upsert([
              {
                id: authData.user.id,
                email: authData.user.email,
                username,
                active: true,
              },
            ], { onConflict: 'id' });

          if (createError) {
            throw new Error(`Failed to create user record: ${createError.message}`);
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
    
    // Clear any cached data to prevent auth issues on next login
    localStorage.removeItem('decision_matrix_auth');
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        // If there's an auth error, attempt to recover the session
        if (error.message.includes('session')) {
          const sessionValid = await validateSession();
          if (!sessionValid) {
            // If session validation fails, try to refresh the session
            const { data, error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError || !data.session) {
              throw error; // If refresh fails, throw the original error
            }
            
            // If refresh succeeds, try to get user again
            const { data: refreshedData, error: getUserError } = await supabase.auth.getUser();
            if (getUserError) throw getUserError;
            return refreshedData.user;
          }
        }
        throw error;
      }
      
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change event:', event);
      callback(session?.user ?? null);
    });
  },
  
  async refreshSession() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        // Return empty data if no session exists instead of trying to refresh
        return { session: null, user: null };
      }
      
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      return data;
    } catch (error) {
      // Only log errors that aren't related to missing session
      if (error instanceof Error && !error.message.includes('Auth session missing')) {
        console.error('Failed to refresh session:', error);
      }
      return { session: null, user: null };
    }
  },

  // Check if there's a valid session
  async hasValidSession() {
    return validateSession();
  },
  
  // Force confirm a user created without email verification
  async manuallyConfirmUser(userId: string) {
    try {
      // This is an admin-level operation, only works with admin key
      // For testing purposes only
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { email_confirm: true }
      );
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error manually confirming user:', error);
      return false;
    }
  }
}; 