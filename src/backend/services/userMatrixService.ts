import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { DecisionMatrix } from '../../frontend/types/matrix.types';

type UserMatrix = Database['public']['Tables']['user_matrices']['Row'];

export const userMatrixService = {
  async getUserMatrices(): Promise<DecisionMatrix[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      const { data, error } = await supabase
        .from('user_matrices')
        .select(`
          matrix_id,
          matrices:matrices(
            *,
            criteria:criteria(*),
            options:options(
              *,
              scores:option_criteria(*)
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('active', true);

      if (error) throw error;
      
      // Extract the matrices from the results and flatten the structure
      const matrices = data?.map(item => item.matrices as unknown as DecisionMatrix) || [];
      return matrices;
    } catch (error) {
      console.error('Error fetching user matrices:', error);
      return [];
    }
  },

  async addUserToMatrix(userId: string, matrixId: string): Promise<UserMatrix> {
    try {
      // First check if the user has access to the matrix
      const { data: matrix, error: matrixError } = await supabase
        .from('matrices')
        .select('owner_id')
        .eq('id', matrixId)
        .single();

      if (matrixError) {
        console.error('Error checking matrix ownership:', matrixError);
        throw new Error('Failed to verify matrix ownership');
      }

      if (!matrix || matrix.owner_id !== userId) {
        console.error('User does not own the matrix:', { userId, matrixOwnerId: matrix?.owner_id });
        throw new Error('User does not have permission to access this matrix');
      }

      // Get the current user to verify authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('Error getting current user:', userError);
        throw new Error('Authentication required');
      }

      if (user.id !== userId) {
        console.error('User ID mismatch:', { currentUserId: user.id, providedUserId: userId });
        throw new Error('User ID mismatch');
      }

      const { data, error } = await supabase
        .from('user_matrices')
        .insert({
          user_id: userId,
          matrix_id: matrixId,
          active: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting user_matrix:', {
          error,
          userId,
          matrixId,
          currentUser: user.id
        });
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in addUserToMatrix:', error);
      throw error;
    }
  },

  async removeUserFromMatrix(userId: string, matrixId: string): Promise<void> {
    const { error } = await supabase
      .from('user_matrices')
      .update({ active: false })
      .eq('user_id', userId)
      .eq('matrix_id', matrixId);

    if (error) throw error;
  },

  async checkUserAccess(userId: string, matrixId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('user_matrices')
      .select('id')
      .eq('user_id', userId)
      .eq('matrix_id', matrixId)
      .eq('active', true)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') { // No rows returned
        return false;
      }
      throw error;
    }
    
    return !!data;
  }
}; 