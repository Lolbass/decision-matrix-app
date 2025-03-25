import { supabase } from './supabase';

export async function testConnection() {
  try {
    const { error } = await supabase.from('users').select('count').single();
    
    if (error) {
      console.error('Connection test failed:', error.message);
      return false;
    }
    
    console.log('Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('Connection test failed:', err);
    return false;
  }
} 