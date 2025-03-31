import { supabase } from '../lib/supabase';
import type { Criterion } from '../../frontend/types/matrix.types';

export const criteriaService = {
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
            active: criterion.active ?? true,
          })),
          { onConflict: 'id' }
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error saving criteria:', error);
      throw error;
    }
  }
}; 