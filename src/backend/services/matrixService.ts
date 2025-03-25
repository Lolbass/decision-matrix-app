import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';
import type { DecisionMatrix } from '../../frontend/types/matrix.types';

type MatrixInsert = Database['public']['Tables']['matrices']['Insert'];
type Criterion = Database['public']['Tables']['criteria']['Row'];
type Option = Database['public']['Tables']['options']['Row'];

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

  async addCriterion(matrixId: string, criterion: Omit<Criterion, 'id' | 'matrix_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('criteria')
      .insert({
        ...criterion,
        matrix_id: matrixId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCriterion(id: string, updates: Partial<Criterion>) {
    const { data, error } = await supabase
      .from('criteria')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCriterion(id: string) {
    const { error } = await supabase
      .from('criteria')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async addOption(matrixId: string, option: Omit<Option, 'id' | 'matrix_id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('options')
      .insert({
        ...option,
        matrix_id: matrixId,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateOption(id: string, updates: Partial<Option>) {
    const { data, error } = await supabase
      .from('options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteOption(id: string) {
    const { error } = await supabase
      .from('options')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  async updateScore(optionId: string, criterionId: string, score: number) {
    const { data, error } = await supabase
      .from('option_criteria')
      .upsert({
        option_id: optionId,
        criterion_id: criterionId,
        score,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async createEmptyMatrix(name: string, description?: string): Promise<DecisionMatrix | null> {
    try {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw userError;

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

      // Create the user_matrices relationship
      const { error: userMatrixError } = await supabase
        .from('user_matrices')
        .insert([
          {
            user_id: user.id,
            matrix_id: matrix.id,
            active: true
          }
        ]);

      if (userMatrixError) throw userMatrixError;

      return matrix;
    } catch (error) {
      console.error('Error creating matrix:', error);
      return null;
    }
  }
}; 