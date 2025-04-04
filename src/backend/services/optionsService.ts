import { supabase } from '../lib/supabase';
import type { Option } from '../../shared/types/matrix.types';
import type { Database } from '../types/database.types';
import { optionCriteriaService } from './optionCriteriaService';

type OptionRow = Database['public']['Tables']['options']['Row'];
type OptionInsert = Database['public']['Tables']['options']['Insert'];

export const optionsService = {
  // Create operations
  async createOption(matrixId: string, option: Omit<OptionInsert, 'id' | 'matrix_id' | 'created_at' | 'updated_at'>) {
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

  // Read operations
  async getOptions(matrixId: string): Promise<OptionRow[]> {
    const { data, error } = await supabase
      .from('options')
      .select(`
        *,
        scores:option_criteria(*)
      `)
      .eq('matrix_id', matrixId)
      .eq('active', true);

    if (error) throw error;
    return data || [];
  },

  async getOptionById(id: string): Promise<OptionRow | null> {
    const { data, error } = await supabase
      .from('options')
      .select(`
        *,
        scores:option_criteria(*)
      `)
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) throw error;
    return data;
  },

  // Update operations
  async updateOption(id: string, updates: Partial<OptionInsert>) {
    const { data, error } = await supabase
      .from('options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete operations
  async deleteOption(id: string) {
    const { error } = await supabase
      .from('options')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },

  // Batch operations
  async saveOptions(matrixId: string, options: Option[]) {
    try {
      // Save options
      const { error: optionsError } = await supabase
        .from('options')
        .upsert(
          options.map(option => ({
            id: option.id,
            matrix_id: matrixId,
            name: option.name,
            description: option.description,
            active: option.active ?? true,
          })),
          { onConflict: 'id' }
        );

      if (optionsError) throw optionsError;

      // Save option-criteria scores using the new service
      const optionCriteriaScores = options.flatMap(option =>
        Object.entries(option.scores).map(([criterionId, score]) => ({
          option_id: option.id,
          criterion_id: criterionId,
          score: score,
        }))
      );

      await optionCriteriaService.saveScores(optionCriteriaScores);
    } catch (error) {
      console.error('Error saving options:', error);
      throw error;
    }
  }
}; 