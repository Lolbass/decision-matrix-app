import { Criterion, Option, DecisionMatrix } from '../types/decisionMatrix';

export function calculateOptionScore(option: Option, criteria: Criterion[]): number {
  return criteria.reduce((total, criterion) => {
    const score = option.scores[criterion.id] || 0;
    return total + (score * criterion.weight);
  }, 0);
}

export function calculateAllScores(matrix: DecisionMatrix): Record<string, number> {
  return matrix.options.reduce((scores, option) => {
    scores[option.id] = calculateOptionScore(option, matrix.criteria);
    return scores;
  }, {} as Record<string, number>);
}

export function validateWeights(criteria: Criterion[]): boolean {
  const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  return Math.abs(totalWeight - 100) < 0.01; // Allow for small floating-point imprecision
}

export function getBestOption(matrix: DecisionMatrix): Option | null {
  if (matrix.options.length === 0) return null;
  
  const scores = calculateAllScores(matrix);
  const bestOptionId = Object.entries(scores).reduce((best, [id, score]) => {
    return score > scores[best] ? id : best;
  }, matrix.options[0].id);

  return matrix.options.find(option => option.id === bestOptionId) || null;
} 