import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { DecisionMatrix } from '../../shared/types/matrix.types';
import { userMatrixService } from './userMatrixService';
import { criteriaService } from './criteriaService';
import { optionsService } from './optionsService';
import { optionCriteriaService } from './optionCriteriaService';

type MatrixInsert = Database['public']['Tables']['matrices']['Insert'];
type OptionRow = Database['public']['Tables']['options']['Row'];
type OptionCriteriaRow = Database['public']['Tables']['option_criteria']['Row'];

export const matrixService = {
  async getMatrices(): Promise<DecisionMatrix[]> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

      const { data, error } = await supabase
        .from('matrices')
        .select(`
          *,
          criteria:criteria(*),
          options:options(
            *,
            scores:option_criteria(*)
          )
        `)
        .eq('owner_id', user.id)
        .eq('active', true);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching matrices:', error);
      return [];
    }
  },

  async getMatrixById(id: string) {
    const { data, error } = await supabase
      .from('matrices')
      .select(`
        *,
        criteria:criteria(*),
        options:options(
          *,
          scores:option_criteria(*)
        )
      `)
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) throw error;

    // Transform the data to match the frontend format
    if (data) {
      data.options = data.options.map((option: OptionRow & { scores: OptionCriteriaRow[] }) => ({
        ...option,
        scores: option.scores.reduce((acc: Record<string, number>, score: OptionCriteriaRow) => {
          acc[score.criterion_id] = score.score;
          return acc;
        }, {})
      }));
    }

    return data;
  },

  async createMatrix(matrix: MatrixInsert) {
    const { data: matrixData, error: matrixError } = await supabase
      .from('matrices')
      .insert(matrix)
      .select()
      .single();

    if (matrixError) throw matrixError;
    return matrixData;
  },

  async updateMatrix(id: string, updates: Partial<MatrixInsert>) {
    const { data, error } = await supabase
      .from('matrices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteMatrix(id: string) {
    const { error } = await supabase
      .from('matrices')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async createEmptyMatrix(name: string, description?: string): Promise<DecisionMatrix | null> {
    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Failed to get session');
      }

      if (!session) {
        // Try to refresh the session
        const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshedSession) {
          console.error('Failed to refresh session:', refreshError);
          throw new Error('Authentication required');
        }
        // Use the refreshed session
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('No user found after refresh:', userError);
          throw new Error('User not found');
        }

        // Create the matrix with the refreshed session
        const { data: matrix, error: matrixError } = await supabase
          .from('matrices')
          .insert([
            {
              name,
              description,
              owner_id: user.id,
              active: true
            }
          ])
          .select()
          .single();

        if (matrixError) throw matrixError;

        // Create the user_matrices relationship using userMatrixService
        try {
          await userMatrixService.addUserToMatrix(user.id, matrix.id);
        } catch (userMatrixError) {
          console.error('Error adding user to matrix:', userMatrixError);
          // If we fail to create the user_matrix relationship, delete the matrix to avoid orphaned records
          await supabase.from('matrices').delete().eq('id', matrix.id);
          throw new Error('Failed to create user-matrix relationship');
        }

        return matrix;
      }

      // If we have a valid session, proceed with the original flow
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('No user found:', userError);
        throw new Error('User not found');
      }

      // Create the matrix
      const { data: matrix, error: matrixError } = await supabase
        .from('matrices')
        .insert([
          {
            name,
            description,
            owner_id: user.id,
            active: true
          }
        ])
        .select()
        .single();

      if (matrixError) throw matrixError;

      // Create the user_matrices relationship using userMatrixService
      try {
        await userMatrixService.addUserToMatrix(user.id, matrix.id);
      } catch (userMatrixError) {
        console.error('Error adding user to matrix:', userMatrixError);
        // If we fail to create the user_matrix relationship, delete the matrix to avoid orphaned records
        await supabase.from('matrices').delete().eq('id', matrix.id);
        throw new Error('Failed to create user-matrix relationship');
      }

      return matrix;
    } catch (error) {
      console.error('Error creating matrix:', error);
      throw error;
    }
  },

  async saveMatrix(matrix: DecisionMatrix) {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('User not authenticated:', userError);
        throw new Error('Authentication required');
      }

      console.log('Saving matrix for user:', user.id);

      // Save matrix details
      const { data: matrixData, error: matrixError } = await supabase
        .from('matrices')
        .upsert({
          id: matrix.id,
          name: matrix.name,
          description: matrix.description,
          owner_id: user.id,
          updated_at: matrix.updated_at,
        }, { onConflict: 'id' });

      if (matrixError) {
        console.error('Matrix save error:', matrixError);
        throw matrixError;
      }

      // Get all existing criteria for this matrix
      const { error: criteriaFetchError } = await supabase
        .from('criteria')
        .select('id')
        .eq('matrix_id', matrix.id);
      
      if (criteriaFetchError) {
        console.error('Error fetching existing criteria:', criteriaFetchError);
        throw criteriaFetchError;
      }

      // Get currentCriteriaIds
      const currentCriteriaIds = matrix.criteria.map(c => c.id);

      // Find criteria that were removed
      const criteriaToDelete = await criteriaService.findRemovedCriteriaIds(matrix.id, currentCriteriaIds);

      if (criteriaToDelete.length > 0) {
        // First delete all related scores from option_criteria table
        await optionCriteriaService.deleteByOptionIds(criteriaToDelete);
        
        // Then delete the criteria themselves
        await criteriaService.deleteCriteriaByIds(criteriaToDelete);

        // Clean up the matrix options object
        matrix.options = matrix.options.map(option => {
          const scores = { ...option.scores };
          criteriaToDelete.forEach(criterionId => {
            delete scores[criterionId];
          });
          return { ...option, scores };
        });
      }

      // Find options that were removed
      const currentOptionIds = matrix.options.map(o => o.id);
      const optionsToDelete = await optionsService.findRemovedOptionIds(matrix.id, currentOptionIds);

      if (optionsToDelete.length > 0) {
        // First delete related option_criteria records
        await optionCriteriaService.deleteByOptionIds(optionsToDelete);
        
        // Then delete the options themselves
        await optionsService.deleteOptionsByIds(optionsToDelete);
      }

      // Save criteria using criteriaService
      await criteriaService.saveCriteria(matrix.id, matrix.criteria);

      // Save options using optionsService 
      // (which will delegate scores saving to optionCriteriaService)
      await optionsService.saveOptions(matrix.id, matrix.options);

      return matrixData;
    } catch (error) {
      console.error('Error saving matrix:', error);
      throw error;
    }
  }
};