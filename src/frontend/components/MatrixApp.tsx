import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { CriteriaManager } from './features/CriteriaManager';
import { OptionsManager } from './features/OptionsManager';
import { EditableTitle } from './ui/EditableTitle';
import { Results } from './features/Results';
import { authService } from '../../backend/services/authService';
import { Navigation } from './layout/Navigation';
import { useMatrix } from '../hooks/useMatrix';
import { useCriteria } from '../hooks/useCriteria';
import { Option } from '../../shared/types/matrix.types';

interface MatrixAppProps {
  onSignOut: () => void;
}

export function MatrixApp({ onSignOut }: MatrixAppProps) {
  const { id } = useParams<{ id: string }>();
  
  const { 
    matrix, 
    isLoading, 
    isSaving, 
    saveError, 
    saveSuccess, 
    handleMatrixChange, 
    handleTitleSave, 
    saveMatrix 
  } = useMatrix(id);
  
  const {
    showInvalidWeights,
    handleCriteriaChange
  } = useCriteria({
    criteria: matrix.criteria,
    onUpdate: (criteria) => handleMatrixChange({ criteria })
  });

  const handleOptionsChange = (options: Option[]) => {
    handleMatrixChange({ options });
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
                      onClick={saveMatrix}
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
                <Alert variant="danger" className="mb-3" onClose={() => handleMatrixChange({})} dismissible>
                  {saveError}
                </Alert>
              )}

              {saveSuccess && (
                <Alert variant="success" className="mb-3" onClose={() => handleMatrixChange({})} dismissible>
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