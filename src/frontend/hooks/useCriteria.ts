import { useState, useCallback } from 'react';
import { Criterion } from '../../shared/types/matrix.types';

interface UseCriteriaProps {
  criteria: Criterion[];
  onUpdate: (criteria: Criterion[]) => void;
}

interface UseCriteriaReturn {
  showInvalidWeights: boolean;
  totalWeight: number;
  isWeightValid: boolean;
  handleAddCriterion: (criterion: Omit<Criterion, 'id'>) => void;
  handleUpdateCriterion: (id: string, updates: Partial<Criterion>) => void;
  handleDeleteCriterion: (id: string) => void;
  handleWeightChange: (id: string, newWeight: number) => void;
  validateWeights: () => boolean;
  handleCriteriaChange: (criteria: Criterion[]) => void;
}

export function useCriteria({ criteria, onUpdate }: UseCriteriaProps): UseCriteriaReturn {
  const [showInvalidWeights, setShowInvalidWeights] = useState(false);
  
  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1) < 0.01;

  const validateWeights = useCallback(() => {
    const valid = Math.abs(totalWeight - 1) < 0.01;
    setShowInvalidWeights(!valid);
    return valid;
  }, [totalWeight]);

  const handleAddCriterion = useCallback((criterion: Omit<Criterion, 'id'>) => {
    const newCriterion: Criterion = {
      ...criterion,
      id: crypto.randomUUID(),
    };
    onUpdate([...criteria, newCriterion]);
    validateWeights();
  }, [criteria, onUpdate, validateWeights]);

  const handleUpdateCriterion = useCallback((id: string, updates: Partial<Criterion>) => {
    onUpdate(
      criteria.map(c => c.id === id ? { ...c, ...updates } : c)
    );
    validateWeights();
  }, [criteria, onUpdate, validateWeights]);

  const handleDeleteCriterion = useCallback((id: string) => {
    onUpdate(criteria.filter(c => c.id !== id));
    validateWeights();
  }, [criteria, onUpdate, validateWeights]);

  const handleWeightChange = useCallback((id: string, newWeight: number) => {
    onUpdate(
      criteria.map(c => c.id === id ? { ...c, weight: newWeight } : c)
    );
    validateWeights();
  }, [criteria, onUpdate, validateWeights]);

  // This wrapper function matches the expected function signature in CriteriaManager
  const handleCriteriaChange = useCallback((criteria: Criterion[]) => {
    onUpdate(criteria);
    validateWeights();
  }, [onUpdate, validateWeights]);

  return {
    showInvalidWeights,
    totalWeight,
    isWeightValid,
    handleAddCriterion,
    handleUpdateCriterion,
    handleDeleteCriterion,
    handleWeightChange,
    validateWeights,
    handleCriteriaChange,
  };
}