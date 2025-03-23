import React, { useState } from 'react';
import { Criterion } from '../types/decisionMatrix';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card, Form, Button, ProgressBar, Modal } from 'react-bootstrap';

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
    <div className="space-y-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Criteria</h5>
        <div className="d-flex align-items-center gap-3">
          <div className="text-muted">
            Total Weight: {(criteria.reduce((sum, c) => sum + c.weight, 0) * 100).toFixed(1)}%
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="d-flex align-items-center"
          >
          <PlusIcon className="h-5 w-5" />
          +
        </Button>
        </div>
      </div>
      
      <div className="row g-4">
        {criteria.map(criterion => (
          <div key={criterion.id} className="col-md-6 col-lg-4">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-1">{criterion.name}</h6>
                    {criterion.description && (
                      <p className="text-muted small mb-0">{criterion.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => handleDeleteCriterion(criterion.id)}
                    className="d-flex align-items-center"
                  >
                    <TrashIcon className="h-4 w-4" />
                    -
                  </Button>
                </div>
                <Form.Group>
                  <Form.Label className="small">Weight (%)</Form.Label>
                  <div className="d-flex align-items-center gap-2">
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      value={criterion.weight * 100}
                      onChange={(e) => handleWeightChange(criterion.id, Number(e.target.value) / 100)}
                      className="w-75"
                    />
                    <ProgressBar
                      now={criterion.weight * 100}
                      className="w-25"
                      variant="primary"
                    />
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Criterion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newCriterion.name}
              onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
              placeholder="Enter criterion name"
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Weight (%)</Form.Label>
            <div className="d-flex align-items-center gap-2">
              <Form.Control
                type="number"
                min="0"
                max="100"
                value={(newCriterion.weight || 0) * 100}
                onChange={(e) => setNewCriterion({ ...newCriterion, weight: Number(e.target.value) / 100 })}
                className="w-75"
              />
              <ProgressBar
                now={(newCriterion.weight || 0) * 100}
                className="w-25"
                variant="primary"
              />
            </div>
          </Form.Group>
          <Form.Group>
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              value={newCriterion.description}
              onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
              placeholder="Enter description"
              rows={2}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleAddCriterion}
            disabled={!newCriterion.name || !newCriterion.weight}
          >
            Add Criterion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 