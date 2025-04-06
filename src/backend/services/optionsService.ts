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
      // First save all options basic info (name, description, etc.)
      const { error: optionsError } = await supabase
        .from('options')
        .upsert(
          options.map(option => ({
            id: option.id,
            matrix_id: matrixId,
            name: option.name, 
            description: option.description,
            //            position: option.position, // Removed because 'position' does not exist on type 'Option'
            active: option.active ?? true,
          })),
          { onConflict: 'id' }
        );
        
      if (optionsError) throw optionsError;
      
      // Delegate the scores saving to optionCriteriaService
      await optionCriteriaService.saveOptionCriteriaScores(options);
      
      return options;
    } catch (error) {
      console.error('Error saving options:', error);
      throw error;
    }
  },

  // Additional operations
  async findRemovedOptionIds(matrixId: string, currentOptionIds: string[]): Promise<string[]> {
    // Get all existing options for this matrix
    const { data: existingOptions, error } = await supabase
      .from('options')
      .select('id')
      .eq('matrix_id', matrixId);
    
    if (error) {
      console.error('Error fetching existing options:', error);
      throw error;
    }

    // Return option IDs that were removed
    return existingOptions
      .filter(o => !currentOptionIds.includes(o.id))
      .map(o => o.id);
  },

  async deleteOptionsByIds(optionIds: string[]): Promise<void> {
    if (optionIds.length === 0) return;
    
    const { error } = await supabase
      .from('options')
      .delete()
      .in('id', optionIds);
    
    if (error) {
      console.error('Error deleting options:', error);
      throw error;
    }
  }
};