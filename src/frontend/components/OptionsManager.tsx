import React, { useState } from 'react';
import { Option, Criterion, ScoringScale } from '../types/decisionMatrix';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import './OptionsManager.css';

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
        acc[criterion.id] = 0 as ScoringScale;
        return acc;
      }, {} as Record<string, ScoringScale>),
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
    <div className="options-manager">
      <div className="header-actions">
        <h5 className="header-title">Options</h5>
        <Button
          variant="success"
          size="sm"
          onClick={() => setShowModal(true)}
          className="add-button"
        >
          <PlusIcon className="icon-sm" />
          Add Option
        </Button>
      </div>

      <div className="table-container">
        <Table hover className="custom-table">
          <thead>
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
                  <div className="option-cell">
                    <div className="option-name">{option.name}</div>
                    {option.description && (
                      <div className="option-description">{option.description}</div>
                    )}
                  </div>
                </td>
                {criteria.map(criterion => (
                  <td key={criterion.id}>
                    <Form.Select
                      size="sm"
                      value={option.scores[criterion.id] || 0}
                      onChange={(e) => handleScoreChange(option.id, criterion.id, Number(e.target.value) as ScoringScale)}
                      className="score-select"
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
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteOption(option.id)}
                    className="delete-button"
                  >
                    <TrashIcon className="icon-sm" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="custom-modal">
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
              className="custom-input"
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
              className="custom-input"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} className="cancel-button">
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleAddOption}
            disabled={!newOption.name}
            className="confirm-button"
          >
            Add Option
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 