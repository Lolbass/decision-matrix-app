import { useState } from 'react';
import { Criterion } from '../types/decisionMatrix';
import { PlusIcon, TrashIcon, ScaleIcon } from '@heroicons/react/24/outline';
import { Card, Form, Button, Modal } from 'react-bootstrap';
import './CriteriaManager.css';

interface CriteriaManagerProps {
  criteria: Criterion[];
  onUpdate: (criteria: Criterion[]) => void;
}

export function CriteriaManager({ criteria, onUpdate }: CriteriaManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [newCriterion, setNewCriterion] = useState<Partial<Criterion>>({
    name: '',
    weight: 0,
    description: '',
  });

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const isWeightValid = Math.abs(totalWeight - 1) < 0.01;

  const handleAddCriterion = () => {
    if (!newCriterion.name || !newCriterion.weight) return;

    const criterion: Criterion = {
      id: crypto.randomUUID(),
      name: newCriterion.name,
      weight: newCriterion.weight,
      description: newCriterion.description,
    };

    onUpdate([...criteria, criterion]);
    setNewCriterion({ name: '', weight: 0, description: '' });
    setShowModal(false);
  };

  const handleDeleteCriterion = (id: string) => {
    onUpdate(criteria.filter(c => c.id !== id));
  };

  const handleWeightChange = (id: string, newWeight: number) => {
    onUpdate(criteria.map(c => 
      c.id === id ? { ...c, weight: newWeight } : c
    ));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewCriterion({ name: '', weight: 0, description: '' });
  };

  return (
    <div className="criteria-manager">
      <div className="criteria-header">
        <div className="header-content">
          <div className="header-title">
            <ScaleIcon className="header-icon" />
            <h5 className="mb-0">Evaluation Criteria</h5>
          </div>
          <div className="weight-summary">
            <div className="weight-indicator">
              <div 
                className="weight-progress" 
                style={{ 
                  width: `${totalWeight * 100}%`,
                  backgroundColor: isWeightValid ? 'var(--accent-primary)' : 'var(--accent-warning)'
                }} 
              />
            </div>
            <div className="weight-text">
              <span className="weight-value" style={{ color: isWeightValid ? 'var(--accent-success)' : 'var(--accent-warning)' }}>
                {(totalWeight * 100).toFixed(0)}%
              </span>
            </div>
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="add-criterion-btn"
            >
              <PlusIcon className="btn-icon" />
              <span>Add Criterion</span>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="criteria-grid">
        {criteria.map((criterion, index) => (
          <div 
            key={criterion.id} 
            className="criterion-wrapper"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Card className="criterion-card">
              <Card.Body>
                <div className="criterion-header">
                  <div className="criterion-title">
                    <h6>{criterion.name}</h6>
                    {criterion.description && (
                      <p className="criterion-description">{criterion.description}</p>
                    )}
                  </div>
                  <Button
                    variant="link"
                    onClick={() => handleDeleteCriterion(criterion.id)}
                    className="delete-button"
                    title="Delete criterion"
                  >
                    <TrashIcon className="icon-sm" />
                  </Button>
                </div>
                <div className="weight-control">
                  <div className="weight-header">
                    <span className="weight-label">Weight</span>
                    <span className="weight-value">{Math.round(criterion.weight * 100)}%</span>
                  </div>
                  <div className="weight-slider">
                    <div 
                      className="weight-track"
                      style={{ width: `${criterion.weight * 100}%` }}
                    />
                    <Form.Range
                      min={0}
                      max={100}
                      value={criterion.weight * 100}
                      onChange={(e) => handleWeightChange(criterion.id, Number(e.target.value) / 100)}
                      className="weight-input"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="criterion-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title">
              <ScaleIcon className="modal-icon" />
              Add New Criterion
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newCriterion.name}
              onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
              placeholder="e.g., Cost, Quality, Time"
              autoFocus
              className="form-input"
            />
          </Form.Group>
          
          <Form.Group className="form-group">
            <Form.Label>Weight</Form.Label>
            <div className="weight-input-group">
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={(newCriterion.weight || 0) * 100}
                onChange={(e) => setNewCriterion({ 
                  ...newCriterion, 
                  weight: Math.min(Math.max(Number(e.target.value) / 100, 0), 1) 
                })}
                className="number-input"
              />
              <div className="weight-visual">
                <div 
                  className="weight-fill"
                  style={{ width: `${(newCriterion.weight || 0) * 100}%` }}
                />
                <span className="weight-percentage">{Math.round((newCriterion.weight || 0) * 100)}%</span>
              </div>
            </div>
            {totalWeight + (newCriterion.weight || 0) > 1 && (
              <small className="text-warning mt-1">
                Total weight will exceed 100%
              </small>
            )}
          </Form.Group>
          
          <Form.Group className="form-group">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              value={newCriterion.description}
              onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
              placeholder="Add details about how this criterion should be evaluated"
              rows={3}
              className="form-input description-input"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="cancel-btn">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCriterion}
            disabled={!newCriterion.name || !newCriterion.weight}
            className="submit-btn"
          >
            Add Criterion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 