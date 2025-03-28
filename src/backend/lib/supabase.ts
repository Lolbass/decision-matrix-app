import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Helper function to check if running in a browser environment
const isBrowser = () => typeof window !== 'undefined'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'decision_matrix_auth',
    storage: isBrowser() ? {
      getItem: (key) => {
        try {
          return localStorage.getItem(key)
        } catch (error) {
          console.error('Error getting auth from localStorage:', error)
          return null
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
        } catch (error) {
          console.error('Error setting auth in localStorage:', error)
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
        } catch (error) {
          console.error('Error removing auth from localStorage:', error)
        }
      }
    } : undefined,
    detectSessionInUrl: true, // Enable session detection in URL for PKCE flow
    flowType: 'pkce'
  },
  global: {
    fetch: (...args) => fetch(...args) // Use native fetch with automatic retry
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
}) 