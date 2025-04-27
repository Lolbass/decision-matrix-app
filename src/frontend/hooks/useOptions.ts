import { useCallback } from 'react';
import { Option, Criterion, ScoringScale } from '../../shared/types/matrix.types';

interface UseOptionsProps {
  options: Option[];
  criteria: Criterion[];
  onUpdate: (options: Option[]) => void;
}

interface UseOptionsReturn {
  handleAddOption: (option: Omit<Option, 'id' | 'scores'>) => void;
  handleUpdateOption: (id: string, updates: Partial<Omit<Option, 'scores'>>) => void;
  handleDeleteOption: (id: string) => void;
  handleScoreChange: (optionId: string, criterionId: string, score: number) => void;
}

export function useOptions({ options, criteria, onUpdate }: UseOptionsProps): UseOptionsReturn {
  const handleAddOption = useCallback((option: Omit<Option, 'id' | 'scores'>) => {
    // Create a new option with empty scores for all criteria
    const scores: Record<string, ScoringScale> = {};
    criteria.forEach(criterion => {
      scores[criterion.id] = 0 as ScoringScale;
    });

    const newOption: Option = {
      ...option,
      id: crypto.randomUUID(),
      scores
    };

    onUpdate([...options, newOption]);
  }, [options, criteria, onUpdate]);

  const handleUpdateOption = useCallback((id: string, updates: Partial<Omit<Option, 'scores'>>) => {
    onUpdate(
      options.map(option => 
        option.id === id ? { ...option, ...updates } : option
      )
    );
  }, [options, onUpdate]);

  const handleDeleteOption = useCallback((id: string) => {
    onUpdate(options.filter(option => option.id !== id));
  }, [options, onUpdate]);

  const handleScoreChange = useCallback((optionId: string, criterionId: string, score: number) => {
    onUpdate(
      options.map(option => {
        if (option.id === optionId) {
          return {
            ...option,
            scores: {
              ...option.scores,
              [criterionId]: score as ScoringScale
            }
          };
        }
        return option;
      })
    );
  }, [options, onUpdate]);

  return {
    handleAddOption,
    handleUpdateOption,
    handleDeleteOption,
    handleScoreChange
  };
}