import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userMatrixService } from '../../backend/services/userMatrixService';
import type { DecisionMatrix } from '../types/matrix.types';
import { PlusCircleIcon, ClipboardDocumentIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline';

export const MatricesPage: React.FC = () => {
  const [matrices, setMatrices] = useState<DecisionMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userMatrixService.getUserMatrices();
        console.log('Matrices:', data);
        setMatrices(data);
      } catch (err) {
        console.error('Error fetching matrices:', err);
        setError('Failed to load matrices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatrices();
  }, []);

  const handleMatrixClick = (matrixId: string) => {
    navigate(`/matrix/${matrixId}`);
  };

  const handleCreateNew = () => {
    navigate('/');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="display-6 fw-bold mb-1">My Decision Matrices</h1>
          <p className="text-muted">Manage and access your decision matrices</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleCreateNew}
          className="btn-icon px-3 py-2"
        >
          <PlusCircleIcon width={20} height={20} />
          <span>Create New Matrix</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : matrices.length === 0 ? (
        <div className="hero-section">
          <Card className="text-center my-5 shadow-sm py-5 border-0">
            <Card.Body className="py-5">
              <div className="empty-animation">
                <ClipboardDocumentIcon width={80} height={80} className="text-muted mb-3" />
              </div>
              <h3 className="fs-4 mb-3">You don't have any matrices yet</h3>
              <p className="text-muted mb-4">Create your first decision matrix to get started</p>
              <Button 
                variant="primary" 
                onClick={handleCreateNew}
                className="btn-icon px-4 py-2 mx-auto"
                size="lg"
              >
                <PlusCircleIcon width={24} height={24} />
                <span>Create Your First Matrix</span>
              </Button>
            </Card.Body>
          </Card>
        </div>
      ) : (
        <Row xs={1} md={2} xl={3} className="g-4">
          {matrices.map((matrix) => (
            <Col key={matrix.id}>
              <Card 
                className="h-100 shadow-sm matrix-card" 
                onClick={() => handleMatrixClick(matrix.id)}
                style={{ cursor: 'pointer', transition: 'transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out' }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'var(--bs-card-box-shadow)';
                }}
              >
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fw-bold mb-2">{matrix.name}</Card.Title>
                  
                  {matrix.description ? (
                    <Card.Text className="text-muted flex-grow-1 mb-3" style={{ fontSize: '0.9rem' }}>
                      {matrix.description.length > 100 
                        ? `${matrix.description.substring(0, 100)}...` 
                        : matrix.description}
                    </Card.Text>
                  ) : (
                    <Card.Text className="text-muted flex-grow-1 mb-3" style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      No description
                    </Card.Text>
                  )}
                  
                  <div className="d-flex gap-3 mb-3">
                    <Badge bg="primary" className="d-flex align-items-center gap-1">
                      <span>{matrix.criteria.length}</span>
                      <span className="ms-1">Criteria</span>
                    </Badge>
                    <Badge bg="secondary" className="d-flex align-items-center gap-1">
                      <span>{matrix.options.length}</span>
                      <span className="ms-1">Options</span>
                    </Badge>
                  </div>
                  
                  <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.8rem' }}>
                    <div className="d-flex align-items-center gap-1">
                      <CalendarIcon width={16} height={16} />
                      <span>{new Date(matrix.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <ClockIcon width={16} height={16} />
                      <span>Updated {new Date(matrix.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-transparent border-top-0">
                  <Button 
                    variant="primary" 
                    className="w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatrixClick(matrix.id);
                    }}
                  >
                    Open Matrix
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}; 