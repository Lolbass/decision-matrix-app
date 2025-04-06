import { supabase } from '../lib/supabase';
import type { Database } from '../types/database.types';

type OptionCriteriaRow = Database['public']['Tables']['option_criteria']['Row'];

export const optionCriteriaService = {
  // Create operations
  async createScore(optionId: string, criterionId: string, score: number) {
    const { data, error } = await supabase
      .from('option_criteria')
      .insert({
        option_id: optionId,
        criterion_id: criterionId,
        score,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Read operations
  async getScores(optionId: string): Promise<OptionCriteriaRow[]> {
    const { data, error } = await supabase
      .from('option_criteria')
      .select('*')
      .eq('option_id', optionId);

    if (error) throw error;
    return data || [];
  },

  async getScore(optionId: string, criterionId: string): Promise<OptionCriteriaRow | null> {
    const { data, error } = await supabase
      .from('option_criteria')
      .select('*')
      .eq('option_id', optionId)
      .eq('criterion_id', criterionId)
      .single();

    if (error) throw error;
    return data;
  },

  // Update operations
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

  // Delete operations
  async deleteScore(optionId: string, criterionId: string) {
    const { error } = await supabase
      .from('option_criteria')
      .delete()
      .eq('option_id', optionId)
      .eq('criterion_id', criterionId);

    if (error) throw error;
  },

  async deleteByOptionIds(optionIds: string[]): Promise<void> {
    if (optionIds.length === 0) return;
    
    const { error } = await supabase
      .from('option_criteria')
      .delete()
      .in('option_id', optionIds);
    
    if (error) {
      console.error('Error deleting option criteria scores:', error);
      throw error;
    }
  },

  // Batch operations
  async saveScores(scores: { option_id: string; criterion_id: string; score: number }[]) {
    const { error } = await supabase
      .from('option_criteria')
      .upsert(
        scores,
        { onConflict: 'option_id,criterion_id' }
      );

    if (error) throw error;
  }
};