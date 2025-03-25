import React, { useState } from 'react';
import { Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { matrixService } from '../../backend/services/matrixService';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [matrixName, setMatrixName] = useState('');
  const [matrixDescription, setMatrixDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateMatrix = async () => {
    if (!matrixName.trim()) return;

    setIsCreating(true);
    try {
      const matrix = await matrixService.createEmptyMatrix(matrixName, matrixDescription);
      if (matrix) {
        navigate(`/matrix/${matrix.id}`);
      }
    } catch (error) {
      console.error('Error creating matrix:', error);
    } finally {
      setIsCreating(false);
      setShowModal(false);
      setMatrixName('');
      setMatrixDescription('');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 mb-4">Welcome to Decision Matrix</h1>
          <p className="lead mb-4">
            Make better decisions by evaluating multiple options against predefined criteria.
            Our intuitive interface helps you weigh different factors and find the best solution.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => setShowModal(true)}
            >
              Create New Matrix
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => navigate('/matrices')}
            >
              View My Matrices
            </Button>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col md={4}>
          <div className="text-center">
            <h3>⚖️ Define Criteria</h3>
            <p>Set up your decision criteria with custom weights to reflect their importance.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="text-center">
            <h3>📝 Add Options</h3>
            <p>Add and evaluate different options against your criteria using a simple scoring system.</p>
          </div>
        </Col>
        <Col md={4}>
          <div className="text-center">
            <h3>📈 Get Results</h3>
            <p>Get instant results with weighted scores to help you make the best decision.</p>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Matrix</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Matrix Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter matrix name"
                value={matrixName}
                onChange={(e) => setMatrixName(e.target.value)}
                autoFocus
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter matrix description"
                value={matrixDescription}
                onChange={(e) => setMatrixDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateMatrix}
            disabled={!matrixName.trim() || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Matrix'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}; 