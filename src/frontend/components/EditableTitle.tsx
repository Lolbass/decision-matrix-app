import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Pencil, Check, X } from 'react-bootstrap-icons';

interface EditableTitleProps {
  title: string;
  description?: string;
  onSave: (title: string, description?: string) => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({ title, description, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedDescription, setEditedDescription] = useState(description || '');

  const handleSave = () => {
    onSave(editedTitle, editedDescription);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedDescription(description || '');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="mb-4">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="h2 mb-2"
            autoFocus
          />
          <Form.Control
            as="textarea"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={2}
            className="text-muted"
          />
        </Form.Group>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" onClick={handleSave}>
            <Check className="me-1" /> Save
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleCancel}>
            <X className="me-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-start gap-3 mb-4">
      <div>
        <h2 className="mb-1">{title}</h2>
        {description && <p className="text-muted mb-0">{description}</p>}
      </div>
      <Button
        variant="outline-secondary"
        size="sm"
        className="mt-1"
        onClick={() => setIsEditing(true)}
      >
        <Pencil />
      </Button>
    </div>
  );
}; 