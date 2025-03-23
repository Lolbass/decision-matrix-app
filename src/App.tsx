import { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { CriteriaManager } from './components/CriteriaManager';
import { OptionsManager } from './components/OptionsManager';
import { calculateAllScores } from './utils/scoreCalculator';
import { DecisionMatrix, Criterion, Option } from './types/decisionMatrix';

function App() {
  const [matrix, setMatrix] = useState<DecisionMatrix>({
    id: crypto.randomUUID(),
    name: 'My Decision Matrix',
    description: 'A decision matrix to help make better decisions',
    criteria: [
      { id: '1', name: 'Cost', weight: 0.4 },
      { id: '2', name: 'Quality', weight: 0.3 },
      { id: '3', name: 'Time', weight: 0.3 },
    ],
    options: [
      { id: '1', name: 'Option A', scores: { '1': 8, '2': 7, '3': 9 } },
      { id: '2', name: 'Option B', scores: { '1': 6, '2': 9, '3': 7 } },
      { id: '3', name: 'Option C', scores: { '1': 9, '2': 6, '3': 8 } },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const [scores, setScores] = useState<Record<string, number>>({});
  const [showInvalidWeights, setShowInvalidWeights] = useState(false);

  const handleMatrixChange = (updates: Partial<DecisionMatrix>) => {
    setMatrix(prev => ({ 
      ...prev, 
      ...updates,
      updatedAt: new Date(),
    }));
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

  return (
    <Container fluid className="py-5 bg-light">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Decision Matrix Name</Form.Label>
                <Form.Control
                  type="text"
                  value={matrix.name}
                  onChange={(e) => handleMatrixChange({ name: e.target.value })}
                  placeholder="Enter matrix name"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  value={matrix.description}
                  onChange={(e) => handleMatrixChange({ description: e.target.value })}
                  placeholder="Enter description"
                />
              </Form.Group>
            </Card.Body>
          </Card>

          {showInvalidWeights && (
            <Alert variant="warning" className="mb-4">
              Warning: Criteria weights must sum to 1.0
            </Alert>
          )}

          <Row>
            <Col xs={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <CriteriaManager
                    criteria={matrix.criteria}
                    onUpdate={handleCriteriaChange}
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12}>
              <Card className="shadow-sm">
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
            <Card.Header className="bg-white">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Results</h5>
                <Button variant="primary" onClick={calculateResults}>
                  Calculate Scores
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {Object.keys(scores).length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Option</th>
                        <th>Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(scores).map(([optionId, score]) => (
                        <tr key={optionId}>
                          <td>
                            {matrix.options.find(opt => opt.id === optionId)?.name}
                          </td>
                          <td>{score.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted">Click "Calculate Scores" to see the results</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
