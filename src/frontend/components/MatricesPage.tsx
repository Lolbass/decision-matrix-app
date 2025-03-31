import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { userMatrixService } from '../../backend/services/userMatrixService';
import type { DecisionMatrix } from '../types/matrix.types';

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
        <h1>My Decision Matrices</h1>
        <Button variant="primary" onClick={handleCreateNew}>
          Create New Matrix
        </Button>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : matrices.length === 0 ? (
        <div className="text-center my-5">
          <p>You don't have any matrices yet.</p>
          <Button variant="primary" onClick={handleCreateNew}>
            Create Your First Matrix
          </Button>
        </div>
      ) : (
        <Table hover responsive>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Created</th>
              <th>Last Updated</th>
              <th>Criteria</th>
              <th>Options</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {matrices.map((matrix) => (
              <tr 
                key={matrix.id} 
                onClick={() => handleMatrixClick(matrix.id)}
                style={{ cursor: 'pointer' }}
              >
                <td className="fw-bold">{matrix.name}</td>
                <td>{matrix.description || '—'}</td>
                <td>{new Date(matrix.created_at).toLocaleDateString()}</td>
                <td>{new Date(matrix.updated_at).toLocaleDateString()}</td>
                <td>{matrix.criteria.length}</td>
                <td>{matrix.options.length}</td>
                <td>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMatrixClick(matrix.id);
                    }}
                  >
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}; 