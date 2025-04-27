import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CriteriaManager } from './features/CriteriaManager';
import { OptionsManager } from './features/OptionsManager';
import { EditableTitle } from './ui/EditableTitle';
import { Results } from './features/Results';
import { DecisionMatrix, Criterion, Option } from '../../shared/types/matrix.types';
import { matrixService } from '../../backend/services/matrixService';
import { authService } from '../../backend/services/authService';
import { Navigation } from './layout/Navigation';
import { supabase } from '../../backend/lib/supabase';

interface MatrixAppProps {
  onSignOut: () => void;
}

export function MatrixApp({ onSignOut }: MatrixAppProps) {
  const { id } = useParams<{ id: string }>();
  const [matrix, setMatrix] = useState<DecisionMatrix>({
    id: id || crypto.randomUUID(),
    name: 'Loading...',
    description: '',
    ownerId: '',
    criteria: [],
    options: [],
    created_at: new Date(),
    updated_at: new Date(),
  });


  const [showInvalidWeights, setShowInvalidWeights] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setIsLoading(true);
        setSaveError(null);

        // Get the current user's ID
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        
        if (user) {
          if (id) {
            // Load the specific matrix
            const loadedMatrix = await matrixService.getMatrixById(id);
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
  }, [id]);

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

  const handleCriteriaChange = (criteria: Criterion[]) => {
    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      setShowInvalidWeights(true);
    } else {
      setShowInvalidWeights(false);
    }
    handleMatrixChange({ criteria });
  };

  const handleOptionsChange = (options: Option[]) => {
    handleMatrixChange({ options });
  };



  const handleSave = async () => {
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

  const handleSignOut = async () => {
    try {
      await authService.signOut();
      onSignOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <Container fluid className="py-3 min-vh-100 page-header">
      <Navigation onSignOut={handleSignOut} />
      <Row className="justify-content-center g-4">
        <Col lg={10}>
          {isLoading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading matrix...</span>
              </div>
            </div>
          ) : (
            <>
              <Card className="shadow-sm mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <EditableTitle
                      title={matrix.name}
                      description={matrix.description}
                      onSave={handleTitleSave}
                    />
                    <Button 
                      variant="primary" 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4"
                    >
                      {isSaving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving...
                        </>
                      ) : 'Save Matrix'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {saveError && (
                <Alert variant="danger" className="mb-3" onClose={() => setSaveError(null)} dismissible>
                  {saveError}
                </Alert>
              )}

              {saveSuccess && (
                <Alert variant="success" className="mb-3" onClose={() => setSaveSuccess(false)} dismissible>
                  Matrix saved successfully!
                </Alert>
              )}

              {showInvalidWeights && (
                <Alert variant="warning" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Warning: Criteria weights must sum to 100%
                </Alert>
              )}

              <Row className="g-3">
                <Col xs={12}>
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body>
                      <CriteriaManager
                        criteria={matrix.criteria}
                        onUpdate={handleCriteriaChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card className="shadow-sm h-100 border-0">
                    <Card.Body>
                      <OptionsManager
                        options={matrix.options}
                        criteria={matrix.criteria}
                        onUpdate={handleOptionsChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="shadow-sm mt-3 border-0">
                <Results matrix={matrix} />
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
} 