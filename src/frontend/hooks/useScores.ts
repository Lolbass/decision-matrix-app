import { useMemo } from 'react';
import { DecisionMatrix, Option } from '../../shared/types/matrix.types';
import { calculateAllScores, getBestOption } from '../utils/scoreCalculator';

interface UseScoresReturn {
  scores: Record<string, number>;
  bestOption: Option | null;
  sortedOptions: Option[];
}

export function useScores(matrix: DecisionMatrix): UseScoresReturn {
  const scores = useMemo(() => calculateAllScores(matrix), [matrix]);
  
  const bestOption = useMemo(() => getBestOption(matrix), [matrix]);
  
  const sortedOptions = useMemo(() => 
    [...matrix.options].sort((a, b) => scores[b.id] - scores[a.id]),
    [matrix.options, scores]
  );

  return {
    scores,
    bestOption,
    sortedOptions
  };
}