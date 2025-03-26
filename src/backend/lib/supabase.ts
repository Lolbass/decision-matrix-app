import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'decision_matrix_auth',
    storage: {
      getItem: (key) => {
        const value = localStorage.getItem(key);
        console.log('Getting auth from storage:', key, value ? 'Found' : 'Not found');
        return value;
      },
      setItem: (key, value) => {
        console.log('Setting auth in storage:', key, value ? 'Value set' : 'No value');
        localStorage.setItem(key, value);
      },
      removeItem: (key) => {
        console.log('Removing auth from storage:', key);
        localStorage.removeItem(key);
      }
    },
    detectSessionInUrl: false,
    flowType: 'pkce'
  }
}) 