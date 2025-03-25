import { supabase } from '../lib/supabase';

export const sharingService = {
  async shareMatrix(matrixId: string, userEmail: string) {
    // First, find the user by email
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (userError) throw userError;

    // Then create the sharing relationship
    const { data, error } = await supabase
      .from('user_matrices')
      .insert({
        user_id: userData.id,
        matrix_id: matrixId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async unshareMatrix(matrixId: string, userId: string) {
    const { error } = await supabase
      .from('user_matrices')
      .delete()
      .match({
        matrix_id: matrixId,
        user_id: userId,
      });

    if (error) throw error;
  },

  async getSharedUsers(matrixId: string) {
    const { data, error } = await supabase
      .from('user_matrices')
      .select(`
        user_id,
        users:users(
          id,
          email,
          username
        )
      `)
      .eq('matrix_id', matrixId);

    if (error) throw error;
    return data;
  },

  async getSharedMatrices(userId: string) {
    const { data, error } = await supabase
      .from('user_matrices')
      .select(`
        matrix_id,
        matrices:matrices(
          *,
          owner:users(
            id,
            email,
            username
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },
}; 