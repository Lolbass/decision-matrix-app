import { supabase } from '../../backend/lib/supabase';
import type { DecisionMatrix, Criterion, Option } from '../types/matrix.types';
import type { Database } from '../../backend/types/database.types';

type MatrixRow = Database['public']['Tables']['matrices']['Row'];
type CriterionRow = Database['public']['Tables']['criteria']['Row'];
type OptionRow = Database['public']['Tables']['options']['Row'];
type OptionCriterionRow = Database['public']['Tables']['option_criteria']['Row'];

const mapMatrixFromDB = (
  matrix: MatrixRow & {
    criteria: CriterionRow[];
    options: (OptionRow & {
      scores: OptionCriterionRow[];
    })[];
  }
): DecisionMatrix => ({
  id: matrix.id,
  name: matrix.name,
  description: matrix.description || '',
  ownerId: matrix.owner_id,
  createdAt: new Date(matrix.created_at),
  updatedAt: new Date(matrix.updated_at),
  active: matrix.active,
  criteria: matrix.criteria.map(c => ({
    id: c.id,
    name: c.name,
    weight: c.weight,
    description: c.description || undefined,
    active: c.active,
  })),
  options: matrix.options.map(o => ({
    id: o.id,
    name: o.name,
    description: o.description || undefined,
    active: o.active,
    scores: o.scores.reduce((acc, s) => ({
      ...acc,
      [s.criterion_id]: s.score,
    }), {}),
  })),
});

export const matrixService = {
  async getMatrices(): Promise<DecisionMatrix[]> {
    const { data, error } = await supabase
      .from('matrices')
      .select(`
        *,
        criteria(*),
        options(
          *,
          scores:option_criteria(*)
        )
      `)
      .eq('active', true);

    if (error) throw error;
    return data.map(mapMatrixFromDB);
  },

  async getMatrixById(id: string): Promise<DecisionMatrix> {
    const { data, error } = await supabase
      .from('matrices')
      .select(`
        *,
        criteria(*),
        options(
          *,
          scores:option_criteria(*)
        )
      `)
      .eq('id', id)
      .eq('active', true)
      .single();

    if (error) throw error;
    return mapMatrixFromDB(data);
  },

  async createMatrix(matrix: Omit<DecisionMatrix, 'id' | 'createdAt' | 'updatedAt'>): Promise<DecisionMatrix> {
    const { data: matrixData, error: matrixError } = await supabase
      .from('matrices')
      .insert({
        name: matrix.name,
        description: matrix.description,
        owner_id: matrix.ownerId,
        active: true,
      })
      .select()
      .single();

    if (matrixError) throw matrixError;

    // Insert criteria
    const criteriaToInsert = matrix.criteria.map(criterion => ({
      matrix_id: matrixData.id,
      name: criterion.name,
      weight: criterion.weight,
      description: criterion.description,
      active: true,
    }));

    const { data: criteriaData, error: criteriaError } = await supabase
      .from('criteria')
      .insert(criteriaToInsert)
      .select();

    if (criteriaError) throw criteriaError;

    // Insert options and their scores
    const optionsToInsert = matrix.options.map(option => ({
      matrix_id: matrixData.id,
      name: option.name,
      description: option.description,
      active: true,
    }));

    const { data: optionsData, error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert)
      .select();

    if (optionsError) throw optionsError;

    // Insert scores
    const scoresToInsert = optionsData.flatMap((option, optionIndex) =>
      Object.entries(matrix.options[optionIndex].scores).map(([criterionId, score]) => ({
        option_id: option.id,
        criterion_id: criterionId,
        score,
        active: true,
      }))
    );

    if (scoresToInsert.length > 0) {
      const { error: scoresError } = await supabase
        .from('option_criteria')
        .insert(scoresToInsert);

      if (scoresError) throw scoresError;
    }

    return this.getMatrixById(matrixData.id);
  },

  async updateMatrix(id: string, updates: Partial<DecisionMatrix>): Promise<DecisionMatrix> {
    const { error: matrixError } = await supabase
      .from('matrices')
      .update({
        name: updates.name,
        description: updates.description,
        active: updates.active,
      })
      .eq('id', id);

    if (matrixError) throw matrixError;

    if (updates.criteria) {
      const { error: criteriaError } = await supabase
        .from('criteria')
        .upsert(
          updates.criteria.map(c => ({
            id: c.id,
            matrix_id: id,
            name: c.name,
            weight: c.weight,
            description: c.description,
            active: c.active,
          }))
        );

      if (criteriaError) throw criteriaError;
    }

    if (updates.options) {
      const { error: optionsError } = await supabase
        .from('options')
        .upsert(
          updates.options.map(o => ({
            id: o.id,
            matrix_id: id,
            name: o.name,
            description: o.description,
            active: o.active,
          }))
        );

      if (optionsError) throw optionsError;

      // Update scores
      for (const option of updates.options) {
        const scoresToUpsert = Object.entries(option.scores).map(([criterionId, score]) => ({
          option_id: option.id,
          criterion_id: criterionId,
          score,
          active: true,
        }));

        if (scoresToUpsert.length > 0) {
          const { error: scoresError } = await supabase
            .from('option_criteria')
            .upsert(scoresToUpsert);

          if (scoresError) throw scoresError;
        }
      }
    }

    return this.getMatrixById(id);
  },

  async deleteMatrix(id: string): Promise<void> {
    const { error } = await supabase
      .from('matrices')
      .update({ active: false })
      .eq('id', id);

    if (error) throw error;
  },
}; 