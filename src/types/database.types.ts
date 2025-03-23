export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          email: string
          created_at: string
          updated_at: string
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      matrices: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          active: boolean
          owner_id: string
        }
        Insert: Omit<Database['public']['Tables']['matrices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['matrices']['Insert']>
      }
      user_matrices: {
        Row: {
          id: string
          user_id: string
          matrix_id: string
          created_at: string
          updated_at: string
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['user_matrices']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['user_matrices']['Insert']>
      }
      criteria: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          active: boolean
          matrix_id: string
          weight: number
        }
        Insert: Omit<Database['public']['Tables']['criteria']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['criteria']['Insert']>
      }
      options: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          active: boolean
          matrix_id: string
        }
        Insert: Omit<Database['public']['Tables']['options']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['options']['Insert']>
      }
      option_criteria: {
        Row: {
          id: string
          option_id: string
          criterion_id: string
          score: number
          created_at: string
          updated_at: string
          active: boolean
        }
        Insert: Omit<Database['public']['Tables']['option_criteria']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['option_criteria']['Insert']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 