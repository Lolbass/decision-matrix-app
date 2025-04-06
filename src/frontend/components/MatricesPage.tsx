import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Spinner, Alert, Row, Col, Badge, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userMatrixService } from '../../backend/services/userMatrixService';
import type { DecisionMatrix } from '../../shared/types/matrix.types';
import { 
  PlusCircleIcon, 
  ClipboardDocumentIcon, 
  CalendarIcon, 
  ClockIcon,
  MagnifyingGlassIcon,
  TrashIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

export const MatricesPage: React.FC = () => {
  const [matrices, setMatrices] = useState<DecisionMatrix[]>([]);
  const [filteredMatrices, setFilteredMatrices] = useState<DecisionMatrix[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'alphabetical'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
          className="btn-icon d-flex align-items-center gap-2 px-3 py-2"
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
          <p className="text-muted mt-3">Loading your matrices...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : matrices.length === 0 ? (
        <div className="hero-section">
          <Card className="text-center my-5 shadow-sm py-5 border-0 bg-light">
            <Card.Body className="py-5">
              <div className="empty-animation">
                <ClipboardDocumentIcon width={80} height={80} className="text-primary mb-3 opacity-75" />
              </div>
              <h3 className="fs-4 mb-3">You don't have any matrices yet</h3>
              <p className="text-muted mb-4">Create your first decision matrix to get started making better choices</p>
              <Button 
                variant="primary" 
                onClick={handleCreateNew}
                className="btn-icon d-flex align-items-center gap-2 px-4 py-2 mx-auto"
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
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
                <InputGroup className="flex-grow-1" style={{ maxWidth: '500px' }}>
                  <InputGroup.Text id="search-icon" className="bg-light border-end-0">
                    <MagnifyingGlassIcon width={20} height={20} className="text-secondary" />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search matrices..."
                    aria-label="Search matrices"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-start-0"
                  />
                </InputGroup>
                
                <div className="d-flex gap-2 align-items-center">
                  <span className="text-muted me-1">View:</span>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Grid view</Tooltip>}>
                    <Button 
                      variant={viewMode === 'grid' ? 'info' : 'outline-secondary'} 
                      className="d-flex align-items-center p-2"
                      onClick={() => setViewMode('grid')}
                    >
                      <Squares2X2Icon width={18} height={18} />
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>List view</Tooltip>}>
                    <Button 
                      variant={viewMode === 'list' ? 'info' : 'outline-secondary'} 
                      className="d-flex align-items-center p-2"
                      onClick={() => setViewMode('list')}
                    >
                      <ListBulletIcon width={18} height={18} />
                    </Button>
                  </OverlayTrigger>
                  
                  <span className="text-muted ms-3 me-1">Sort:</span>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Sort by newest</Tooltip>}>
                    <Button 
                      variant={sortOrder === 'newest' ? 'info' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleSortChange('newest')}
                      className="d-flex align-items-center"
                    >
                      <span>Newest</span>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Sort by oldest</Tooltip>}>
                    <Button 
                      variant={sortOrder === 'oldest' ? 'info' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleSortChange('oldest')}
                      className="d-flex align-items-center"
                    >
                      <span>Oldest</span>
                    </Button>
                  </OverlayTrigger>
                  <OverlayTrigger placement="top" overlay={<Tooltip>Sort alphabetically</Tooltip>}>
                    <Button 
                      variant={sortOrder === 'alphabetical' ? 'info' : 'outline-secondary'} 
                      size="sm"
                      onClick={() => handleSortChange('alphabetical')}
                      className="d-flex align-items-center"
                    >
                      <span>A-Z</span>
                    </Button>
                  </OverlayTrigger>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {filteredMatrices.length === 0 ? (
            <Alert variant="info" className="text-center my-5">
              <p className="mb-2">No matrices match your search.</p>
              <p>Try a different search term or <Button variant="link" onClick={handleCreateNew} className="p-0">create a new matrix</Button>.</p>
            </Alert>
          ) : viewMode === 'grid' ? (
            <Row xs={1} md={2} xl={3} className="g-4">
              {filteredMatrices.map((matrix) => (
                <Col key={matrix.id}>
                  <Card 
                    className="h-100 shadow-sm matrix-card border-0 transition-all" 
                    onClick={() => handleMatrixClick(matrix.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Card.Body className="d-flex flex-column p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Card.Title className="fw-bold h5">{matrix.name}</Card.Title>
                        <OverlayTrigger placement="top" overlay={<Tooltip>Delete matrix</Tooltip>}>
                          <Button
                            variant="link"
                            className="p-1 text-danger rounded-circle"
                            onClick={(e) => handleDeleteMatrix(e, matrix.id)}
                          >
                            <TrashIcon width={18} height={18} />
                          </Button>
                        </OverlayTrigger>
                      </div>
                      
                      {matrix.description ? (
                        <Card.Text className="text-muted flex-grow-1 mb-3" style={{ fontSize: '0.9rem' }}>
                          {matrix.description.length > 100 
                            ? `${matrix.description.substring(0, 100)}...` 
                            : matrix.description}
                        </Card.Text>
                      ) : (
                        <Card.Text className="text-muted flex-grow-1 mb-3 fst-italic" style={{ fontSize: '0.9rem' }}>
                          No description
                        </Card.Text>
                      )}
                      
                      <div className="d-flex gap-3 mb-3">
                        <Badge 
                          bg="info" 
                          className="d-flex align-items-center gap-1 py-2 px-3 rounded-pill" 
                        >
                          <span className="fw-bold">{matrix.criteria.length}</span>
                          <span className="ms-1">Criteria</span>
                        </Badge>
                        <Badge 
                          bg="info" 
                          className="d-flex align-items-center gap-1 py-2 px-3 rounded-pill"
                        >
                          <span className="fw-bold">{matrix.options.length}</span>
                          <span className="ms-1">Options</span>
                        </Badge>
                      </div>
                      
                      <div className="d-flex justify-content-between text-muted mb-3" style={{ fontSize: '0.85rem' }}>
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
                    <Card.Footer className="bg-dark border-top p-3">
                      <Button 
                        variant="outline-primary" 
                        className="w-100 d-flex align-items-center justify-content-center gap-2"
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
          ) : (
            <div className="list-view">
              {filteredMatrices.map((matrix) => (
                <Card 
                  key={matrix.id}
                  className="mb-3 shadow-sm border-0 transition-all" 
                  onClick={() => handleMatrixClick(matrix.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body className="p-4">
                    <div className="d-flex flex-wrap justify-content-between gap-3">
                      <div className="d-flex flex-column flex-grow-1" style={{ maxWidth: '60%' }}>
                        <div className="d-flex justify-content-between align-items-start">
                          <h5 className="mb-2 fw-bold">{matrix.name}</h5>
                        </div>
                        
                        {matrix.description ? (
                          <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                            {matrix.description.length > 150 
                              ? `${matrix.description.substring(0, 150)}...` 
                              : matrix.description}
                          </p>
                        ) : (
                          <p className="text-muted mb-3 fst-italic" style={{ fontSize: '0.9rem' }}>
                            No description
                          </p>
                        )}
                      </div>
                      
                      <div className="d-flex flex-column align-items-end justify-content-between">
                        <OverlayTrigger placement="left" overlay={<Tooltip>Delete matrix</Tooltip>}>
                          <Button
                            variant="link"
                            className="p-1 text-danger rounded-circle mb-3"
                            onClick={(e) => handleDeleteMatrix(e, matrix.id)}
                          >
                            <TrashIcon width={18} height={18} />
                          </Button>
                        </OverlayTrigger>
                        
                        <div className="d-flex flex-column align-items-end">
                          <div className="d-flex gap-2 mb-2">
                            <Badge 
                              bg="info" 
                              className="d-flex align-items-center gap-1 py-2 px-3 rounded-pill" 
                            >
                              <span className="fw-bold">{matrix.criteria.length}</span>
                              <span className="ms-1">Criteria</span>
                            </Badge>
                            <Badge 
                              bg="info" 
                              className="d-flex align-items-center gap-1 py-2 px-3 rounded-pill"
                            >
                              <span className="fw-bold">{matrix.options.length}</span>
                              <span className="ms-1">Options</span>
                            </Badge>
                          </div>
                          
                          <div className="d-flex flex-column align-items-end text-muted" style={{ fontSize: '0.85rem' }}>
                            <div className="d-flex align-items-center gap-1 mb-1">
                              <CalendarIcon width={16} height={16} />
                              <span>Created: {new Date(matrix.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <ClockIcon width={16} height={16} />
                              <span>Updated: {new Date(matrix.updated_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                      
                    <div className="d-flex justify-content-end mt-3">
                      <Button 
                        variant="primary" 
                        className="d-flex align-items-center justify-content-center gap-2"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMatrixClick(matrix.id);
                        }}
                      >
                        <span>Open Matrix</span>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </Container>
  );
};