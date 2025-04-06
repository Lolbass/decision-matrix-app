import { supabase } from '../lib/supabase';
import type { Criterion } from '../../shared/types/matrix.types';
import type { Database } from '../types/database.types';

type CriterionRow = Database['public']['Tables']['criteria']['Row'];
type CriterionInsert = Database['public']['Tables']['criteria']['Insert'];

export const criteriaService = {
  // Create operations
  async createCriterion(matrixId: string, criterion: Omit<CriterionInsert, 'id' | 'matrix_id' | 'created_at' | 'updated_at'>) {
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

  // Read operations
  async getCriteria(matrixId: string): Promise<CriterionRow[]> {
    const { data, error } = await supabase
      .from('criteria')
      .select('*')
      .eq('matrix_id', matrixId)
      .eq('active', true);

    if (error) throw error;
    return data || [];
  },

  async getCriterionById(id: string): Promise<CriterionRow | null> {
    const { data, error } = await supabase
      .from('criteria')
      .select('*')
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Update operations
  async updateCriterion(id: string, updates: Partial<CriterionInsert>) {
    const { data, error } = await supabase
      .from('criteria')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete operations
  async deleteCriterion(id: string) {
    const { error } = await supabase
      .from('criteria')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Batch operations
  async saveCriteria(matrixId: string, criteria: Criterion[]) {
    try {
      const { error } = await supabase
        .from('criteria')
        .upsert(
          criteria.map(criterion => ({
            id: criterion.id,
            matrix_id: matrixId,
            name: criterion.name,
            weight: criterion.weight,
            description: criterion.description,
            active: criterion.active ?? true,
          })),
          { onConflict: 'id' }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving criteria:', error);
      throw error;
    }
  },

  // Additional operations
  async findRemovedCriteriaIds(matrixId: string, currentCriteriaIds: string[]): Promise<string[]> {
    // Get all existing criteria for this matrix
    const { data: existingCriteria, error: criteriaFetchError } = await supabase
      .from('criteria')
      .select('id')
      .eq('matrix_id', matrixId);
    
    if (criteriaFetchError) {
      console.error('Error fetching existing criteria:', criteriaFetchError);
      throw criteriaFetchError;
    }

    // Return criteria IDs that were removed
    return existingCriteria
      .filter(c => !currentCriteriaIds.includes(c.id))
      .map(c => c.id);
  },

  async deleteCriteriaByIds(criteriaIds: string[]): Promise<void> {
    if (criteriaIds.length === 0) return;
    
    const { error } = await supabase
      .from('criteria')
      .delete()
      .in('id', criteriaIds);
    
    if (error) {
      console.error('Error deleting criteria:', error);
      throw error;
    }
  }
};