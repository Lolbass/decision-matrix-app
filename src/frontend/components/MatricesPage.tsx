import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge, Form, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userMatrixService } from '../../backend/services/userMatrixService';
import type { DecisionMatrix } from '../../shared/types/matrix.types';
import { 
  PlusCircleIcon, 
  ClipboardDocumentIcon, 
  CalendarIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export const MatricesPage: React.FC = () => {
  const [matrices, setMatrices] = useState<DecisionMatrix[]>([]);
  const [filteredMatrices, setFilteredMatrices] = useState<DecisionMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatrices = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userMatrixService.getUserMatrices();
        setMatrices(data);
        setFilteredMatrices(data);
      } catch (err) {
        console.error('Error fetching matrices:', err);
        setError('Failed to load matrices. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMatrices();
  }, []);

  useEffect(() => {
    // Filter matrices based on search term
    const filtered = matrices.filter(matrix => 
      matrix.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (matrix.description && matrix.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Sort filtered matrices
    const sorted = [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredMatrices(sorted);
  }, [matrices, searchTerm, sortOrder]);

  const handleMatrixClick = (matrixId: string) => {
    navigate(`/matrix/${matrixId}`);
  };

  const handleCreateNew = () => {
    navigate('/');
  };

  const handleDeleteMatrix = async (e: React.MouseEvent, matrixId: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this matrix?')) {
      try {
        await userMatrixService.deleteUserMatrix(matrixId);
        setMatrices(matrices.filter(matrix => matrix.id !== matrixId));
      } catch (err) {
        console.error('Error deleting matrix:', err);
        alert('Failed to delete matrix. Please try again.');
      }
    }
  };

  const handleSortChange = (newSortOrder: 'newest' | 'oldest' | 'alphabetical') => {
    setSortOrder(newSortOrder);
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
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <InputGroup className="w-50">
              <InputGroup.Text id="search-icon" className="bg-light border-end-0">
                <MagnifyingGlassIcon width={20} height={20} className="text-muted" />
              </InputGroup.Text>
              <Form.Control
                placeholder="Search matrices..."
                aria-label="Search matrices"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-start-0"
              />
            </InputGroup>
            
            <div className="d-flex gap-2">
              <Button 
                variant={sortOrder === 'newest' ? 'primary' : 'outline-secondary'} 
                size="sm"
                onClick={() => handleSortChange('newest')}
                className="d-flex align-items-center gap-1"
              >
                <ArrowsUpDownIcon width={16} height={16} />
                Newest
              </Button>
              <Button 
                variant={sortOrder === 'oldest' ? 'primary' : 'outline-secondary'} 
                size="sm"
                onClick={() => handleSortChange('oldest')}
                className="d-flex align-items-center gap-1"
              >
                <ArrowsUpDownIcon width={16} height={16} />
                Oldest
              </Button>
              <Button 
                variant={sortOrder === 'alphabetical' ? 'primary' : 'outline-secondary'} 
                size="sm"
                onClick={() => handleSortChange('alphabetical')}
                className="d-flex align-items-center gap-1"
              >
                <ArrowsUpDownIcon width={16} height={16} />
                A-Z
              </Button>
            </div>
          </div>
          
          {filteredMatrices.length === 0 ? (
            <Alert variant="info" className="text-center my-5">
              No matrices match your search. Try a different search term or <Button variant="link" onClick={handleCreateNew} className="p-0">create a new matrix</Button>.
            </Alert>
          ) : (
            <Row xs={1} md={2} xl={3} className="g-4">
              {filteredMatrices.map((matrix) => (
                <Col key={matrix.id}>
                  <Card 
                    className="h-100 shadow-sm matrix-card border-0" 
                    onClick={() => handleMatrixClick(matrix.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="fw-bold">{matrix.name}</Card.Title>
                        <Button
                          variant="link"
                          className="p-0 text-danger"
                          onClick={(e) => handleDeleteMatrix(e, matrix.id)}
                          title="Delete matrix"
                        >
                          <TrashIcon width={18} height={18} />
                        </Button>
                      </div>
                      
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
                        className="w-100 btn-icon justify-content-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMatrixClick(matrix.id);
                        }}
                      >
                        <span>Open Matrix</span>
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </>
      )}
    </Container>
  );
}; 