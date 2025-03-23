import { supabase } from '../../backend/lib/supabase';
import type { User } from './auth.service';

interface SharedUser {
  id: string;
  email: string;
  username: string;
}

interface SharedMatrix {
  id: string;
  name: string;
  description: string | null;
  owner: SharedUser;
}

export const sharingService = {
  async shareMatrix(matrixId: string, userEmail: string): Promise<void> {
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) throw userError;

    // Then create the sharing relationship
    const { error } = await supabase
      .from('user_matrices')
      .insert({
        user_id: userData.id,
        matrix_id: matrixId,
        active: true,
      });

    if (error) throw error;
  },

  async unshareMatrix(matrixId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_matrices')
      .update({ active: false })
      .match({
        matrix_id: matrixId,
        user_id: userId,
      });

    if (error) throw error;
  },

  async getSharedUsers(matrixId: string): Promise<SharedUser[]> {
    const { data, error } = await supabase
      .from('user_matrices')
      .select(`
        users:users(
          id,
          email,
          username
        )
      `)
      .eq('matrix_id', matrixId)
      .eq('active', true);

    if (error) throw error;
    return data.map(d => d.users);
  },

  async getSharedMatrices(userId: string): Promise<SharedMatrix[]> {
    const { data, error } = await supabase
      .from('user_matrices')
      .select(`
        matrices:matrices(
          id,
          name,
          description,
          owner:users(
            id,
            email,
            username
          )
        )
      `)
      .eq('user_id', userId)
      .eq('active', true);

    if (error) throw error;
    return data.map(d => ({
      ...d.matrices,
      owner: d.matrices.owner,
    }));
  },
}; 