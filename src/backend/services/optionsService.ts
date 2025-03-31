import { supabase } from '../lib/supabase';
import type { Option } from '../../frontend/types/matrix.types';

export const optionsService = {
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
            active: option.active ?? true,
          })),
          { onConflict: 'id' }
        );

      if (optionsError) throw optionsError;

      // Save option-criteria scores
      const optionCriteriaScores = options.flatMap(option =>
        Object.entries(option.scores).map(([criterionId, score]) => ({
          option_id: option.id,
          criterion_id: criterionId,
          score: score,
        }))
      );

      const { error: scoresError } = await supabase
        .from('option_criteria')
        .upsert(
          optionCriteriaScores,
          { onConflict: 'option_id,criterion_id' }
        );

      if (scoresError) throw scoresError;
    } catch (error) {
      console.error('Error saving options:', error);
      throw error;
    }
  }
}; 