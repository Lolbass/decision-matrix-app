import { useState, useEffect } from 'react';
import { DecisionMatrix } from '../../shared/types/matrix.types';
import { matrixService } from '../../backend/services/matrixService';
import { supabase } from '../../backend/lib/supabase';

interface UseMatrixReturn {
  matrix: DecisionMatrix;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  handleMatrixChange: (updates: Partial<DecisionMatrix>) => void;
  handleTitleSave: (title: string, description?: string) => void;
  saveMatrix: () => Promise<void>;
}

export function useMatrix(matrixId?: string): UseMatrixReturn {
  const [matrix, setMatrix] = useState<DecisionMatrix>({
    id: matrixId || crypto.randomUUID(),
    name: 'New Decision Matrix',
    description: '',
    ownerId: '',
    criteria: [],
    options: [],
    created_at: new Date(),
    updated_at: new Date(),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setIsLoading(true);
        setSaveError(null);

        // Get the current user's ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user) {
          if (matrixId) {
            // Load the specific matrix
            const loadedMatrix = await matrixService.getMatrixById(matrixId);
            if (loadedMatrix) {
              setMatrix({
                ...loadedMatrix,
                ownerId: user.id,
              });
            }
          } else {
            // Create a new matrix
            setMatrix((prev) => ({
              ...prev,
              ownerId: user.id,
            }));
          }
        }
      } catch (error) {
        console.error('Error loading matrix:', error);
        setSaveError('Failed to load matrix');
      } finally {
        setIsLoading(false);
      }
    };

    loadMatrixData();
  }, [matrixId]);

  const handleMatrixChange = (updates: Partial<DecisionMatrix>) => {
    setMatrix((prev: DecisionMatrix) => ({ 
      ...prev, 
      ...updates,
      updated_at: new Date(),
    }));
    setSaveSuccess(false);
  };

  const handleTitleSave = (title: string, description?: string) => {
    handleMatrixChange({ name: title, description });
  };

  const saveMatrix = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await matrixService.saveMatrix(matrix);
      setSaveSuccess(true);
    } catch (error) {
      console.error('Error saving matrix:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save matrix');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    matrix,
    isLoading,
    isSaving,
    saveError,
    saveSuccess,
    handleMatrixChange,
    handleTitleSave,
    saveMatrix,
  };
}