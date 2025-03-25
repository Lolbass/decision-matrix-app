import React, { useState } from 'react';
import { Option, Criterion, ScoringScale } from '../types/decisionMatrix';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Card, Form, Button, Table, Modal } from 'react-bootstrap';

interface OptionsManagerProps {
  options: Option[];
  criteria: Criterion[];
  onUpdate: (options: Option[]) => void;
}

export function OptionsManager({ options, criteria, onUpdate }: OptionsManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [newOption, setNewOption] = useState<Partial<Option>>({
    name: '',
    description: '',
    scores: {},
  });

  const handleAddOption = () => {
    if (!newOption.name) return;

    const option: Option = {
      id: crypto.randomUUID(),
      name: newOption.name,
      description: newOption.description,
      scores: criteria.reduce((acc, criterion) => {
        acc[criterion.id] = 0;
        return acc;
      }, {} as Record<string, number>),
    };

    onUpdate([...options, option]);
    setNewOption({ name: '', description: '', scores: {} });
    setShowModal(false);
  };

  const handleDeleteOption = (id: string) => {
    onUpdate(options.filter(o => o.id !== id));
  };

  const handleScoreChange = (optionId: string, criterionId: string, score: ScoringScale) => {
    onUpdate(options.map(option => 
      option.id === optionId
        ? { ...option, scores: { ...option.scores, [criterionId]: score } }
        : option
    ));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewOption({ name: '', description: '', scores: {} });
  };

  return (
    <div className="space-y-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Options</h5>
        <Button
          variant="primary"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center justify-content-center"
        >
          <PlusIcon className="h-5 w-5" />
          +
        </Button>
      </div>

      <Card>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Option</th>
                  {criteria.map(criterion => (
                    <th key={criterion.id}>{criterion.name}</th>
                  ))}
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {options.map(option => (
                  <tr key={option.id}>
                    <td>
                      <div>
                        <div className="fw-medium">{option.name}</div>
                        {option.description && (
                          <div className="text-muted small">{option.description}</div>
                        )}
                      </div>
                    </td>
                    {criteria.map(criterion => (
                      <td key={criterion.id}>
                        <Form.Select
                          size="sm"
                          value={option.scores[criterion.id] || 0}
                          onChange={(e) => handleScoreChange(option.id, criterion.id, Number(e.target.value) as ScoringScale)}
                        >
                          <option value={0}>Not Rated</option>
                          {[1, 2, 3, 4, 5].map(score => (
                            <option key={score} value={score}>
                              {score}
                            </option>
                          ))}
                        </Form.Select>
                      </td>
                    ))}
                    <td className="text-center">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => handleDeleteOption(option.id)}
                        className="d-flex align-items-right justify-content-right"
                      >
                        <TrashIcon className="h-4 w-4" />
                        -
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Option</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newOption.name}
              onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
              placeholder="Enter option name"
              autoFocus
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              value={newOption.description}
              onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
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
            onClick={handleAddOption}
            disabled={!newOption.name}
          >
            Add Option
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 