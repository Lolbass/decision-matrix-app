import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CriteriaManager } from './CriteriaManager';
import { OptionsManager } from './OptionsManager';
import { EditableTitle } from './EditableTitle';
import { calculateAllScores } from '../utils/scoreCalculator';
import { DecisionMatrix, Criterion, Option } from '../../shared/types/matrix.types';
import { matrixService } from '../../backend/services/matrixService';
import { authService } from '../../backend/services/authService';
import { Navigation } from './Navigation';
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

  const [scores, setScores] = useState<Record<string, number>>({});
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

  const calculateResults = () => {
    const results = calculateAllScores(matrix);
    setScores(results);
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
    <Container fluid className="py-5 bg-light min-vh-100">
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
              <Card className="shadow-sm mb-4">
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
                <Alert variant="danger" className="mb-4" onClose={() => setSaveError(null)} dismissible>
                  {saveError}
                </Alert>
              )}

              {saveSuccess && (
                <Alert variant="success" className="mb-4" onClose={() => setSaveSuccess(false)} dismissible>
                  Matrix saved successfully!
                </Alert>
              )}

              {showInvalidWeights && (
                <Alert variant="warning" className="mb-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Warning: Criteria weights must sum to 1.0
                </Alert>
              )}

              <Row className="g-4">
                <Col xs={12}>
                  <Card className="shadow-sm h-100">
                    <Card.Header className="bg-white py-3">
                      <h5 className="mb-0">Criteria</h5>
                    </Card.Header>
                    <Card.Body>
                      <CriteriaManager
                        criteria={matrix.criteria}
                        onUpdate={handleCriteriaChange}
                      />
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12}>
                  <Card className="shadow-sm h-100">
                    <Card.Header className="bg-white py-3">
                      <h5 className="mb-0">Options</h5>
                    </Card.Header>
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

              <Card className="shadow-sm mt-4">
                <Card.Header className="bg-white py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Results</h5>
                    <Button 
                      variant="primary" 
                      onClick={calculateResults}
                      className="px-4"
                      disabled={matrix.options.length === 0 || matrix.criteria.length === 0}
                    >
                      Calculate Scores
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {Object.keys(scores).length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead>
                          <tr>
                            <th className="border-bottom">Option</th>
                            <th className="border-bottom text-end" style={{ width: '200px' }}>Score</th>
                            <th className="border-bottom" style={{ width: '50%' }}>Visualization</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(scores)
                            .sort(([, a], [, b]) => b - a)
                            .map(([optionId, score]) => {
                              const option = matrix.options.find((opt: Option) => opt.id === optionId);
                              const maxScore = Math.max(...Object.values(scores));
                              const percentage = (score / maxScore) * 100;
                              
                              return (
                                <tr key={optionId}>
                                  <td>
                                    <div className="fw-medium">{option?.name}</div>
                                    {option?.description && (
                                      <small className="text-muted">{option.description}</small>
                                    )}
                                  </td>
                                  <td className="text-end fw-bold">
                                    {score.toFixed(2)}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center gap-2">
                                      <div className="flex-grow-1">
                                        <div className="progress" style={{ height: '10px' }}>
                                          <div
                                            className="progress-bar bg-primary"
                                            role="progressbar"
                                            style={{ width: `${percentage}%` }}
                                            aria-valuenow={percentage}
                                            aria-valuemin={0}
                                            aria-valuemax={100}
                                          />
                                        </div>
                                      </div>
                                      <small className="text-muted" style={{ width: '45px' }}>
                                        {percentage.toFixed(0)}%
                                      </small>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">
                        {matrix.options.length === 0 || matrix.criteria.length === 0 ? (
                          'Add options and criteria to calculate scores'
                        ) : (
                          'Click "Calculate Scores" to see the results'
                        )}
                      </p>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
} 