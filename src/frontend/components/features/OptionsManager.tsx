import { useState } from 'react';
import { Option, Criterion, ScoringScale } from '../../../shared/types/matrix.types';
import { PlusIcon, TrashIcon, ListBulletIcon, Squares2X2Icon, StarIcon } from '@heroicons/react/24/outline';
import { Form, Button, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './OptionsManager.css';

interface OptionsManagerProps {
  options: Option[];
  criteria: Criterion[];
  onUpdate: (options: Option[]) => void;
}

export function OptionsManager({ options, criteria, onUpdate }: OptionsManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [newOption, setNewOption] = useState<Partial<Option>>({
    name: '',
    description: '',
    scores: {},
  });

  const getAverageScore = (scores: Record<string, ScoringScale>) => {
    const validScores = Object.values(scores).filter(score => score > 0) as number[];
    if (validScores.length === 0) return 0;
    return validScores.reduce((sum, score) => sum + score, 0) / validScores.length;
  };

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
        <div className="header-title">
          <StarIcon className="header-icon" />
          <h5>Options & Scoring</h5>
        </div>
        <div className="header-controls">
          <div className="view-toggles">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'secondary'}
              className="view-toggle"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Squares2X2Icon className="icon-sm" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'primary' : 'secondary'}
              className="view-toggle"
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <ListBulletIcon className="icon-sm" />
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            className="add-button"
          >
            <PlusIcon className="icon-sm" />
            Add Option
          </Button>
        </div>
      </div>

      <div className={`options-content ${viewMode}`}>
        {viewMode === 'grid' ? (
          <div className="options-grid">
            {options.map((option, index) => {
              const avgScore = getAverageScore(option.scores);
              return (
                <div 
                  key={option.id} 
                  className="option-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="option-header">
                    <div className="option-info">
                      <h6 className="option-name">{option.name}</h6>
                      {option.description && (
                        <p className="option-description">{option.description}</p>
                      )}
                    </div>
                    <Button
                      variant="link"
                      onClick={() => handleDeleteOption(option.id)}
                      className="delete-button"
                      title="Delete option"
                    >
                      <TrashIcon className="icon-sm" />
                    </Button>
                  </div>
                  
                  <div className="criteria-scores">
                    {criteria.map(criterion => (
                      <div key={criterion.id} className="criterion-score">
                        <OverlayTrigger
                          placement="top"
                          overlay={(
                            <Tooltip>{criterion.name}</Tooltip>
                          )}
                        >
                          <div className="score-label">{criterion.name}</div>
                        </OverlayTrigger>
                        <Form.Select
                          size="sm"
                          value={option.scores[criterion.id] || 0}
                          onChange={(e) => handleScoreChange(option.id, criterion.id, Number(e.target.value) as ScoringScale)}
                          className="score-select"
                        >
                          <option value={0}>-</option>
                          {[1, 2, 3, 4, 5].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </Form.Select>
                      </div>
                    ))}
                  </div>

                  <div className="option-footer">
                    <div className="average-score">
                      <span className="score-label">Average Score</span>
                      <div className="score-display">
                        <div 
                          className="score-bar" 
                          style={{ width: `${(avgScore / 5) * 100}%` }} 
                        />
                        <span className="score-value">{avgScore.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="table-view">
            <table className="options-table">
              <thead>
                <tr>
                  <th className="option-column">Option</th>
                  {criteria.map(criterion => (
                    <th key={criterion.id} className="score-column">
                      <OverlayTrigger
                        placement="top"
                        overlay={(
                          <Tooltip>
                            Weight: {(criterion.weight * 100).toFixed(0)}%
                          </Tooltip>
                        )}
                      >
                        <span>{criterion.name}</span>
                      </OverlayTrigger>
                    </th>
                  ))}
                  <th className="action-column">Actions</th>
                </tr>
              </thead>
              <tbody>
                {options.map(option => (
                  <tr key={option.id}>
                    <td className="option-column">
                      <div className="option-info">
                        <div className="option-name">{option.name}</div>
                        {option.description && (
                          <div className="option-description">{option.description}</div>
                        )}
                      </div>
                    </td>
                    {criteria.map(criterion => (
                      <td key={criterion.id} className="score-column">
                        <Form.Select
                          size="sm"
                          value={option.scores[criterion.id] || 0}
                          onChange={(e) => handleScoreChange(option.id, criterion.id, Number(e.target.value) as ScoringScale)}
                          className="score-select"
                        >
                          <option value={0}>-</option>
                          {[1, 2, 3, 4, 5].map(score => (
                            <option key={score} value={score}>{score}</option>
                          ))}
                        </Form.Select>
                      </td>
                    ))}
                    <td className="action-column">
                      <Button
                        variant="link"
                        onClick={() => handleDeleteOption(option.id)}
                        className="delete-button"
                        title="Delete option"
                      >
                        <TrashIcon className="icon-sm" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} centered className="option-modal">
        <Modal.Header closeButton>
          <Modal.Title>
            <div className="modal-title">
              <PlusIcon className="modal-icon" />
              Add New Option
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="form-group">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={newOption.name}
              onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
              placeholder="e.g., Option A, Alternative 1"
              autoFocus
              className="form-input"
            />
          </Form.Group>
          
          <Form.Group className="form-group mb-0">
            <Form.Label>Description (optional)</Form.Label>
            <Form.Control
              as="textarea"
              value={newOption.description}
              onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
              placeholder="Add details about this option"
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
            onClick={handleAddOption}
            disabled={!newOption.name}
            className="submit-btn"
          >
            Add Option
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 