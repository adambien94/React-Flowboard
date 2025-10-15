import { useState, type FormEvent, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

type AddColumnModalProps = {
  show: boolean;
  onHide: () => void;
  onSave: (name: string, color: string) => void;
};

export default function AddColumnModal({
  show,
  onHide,
  onSave,
}: AddColumnModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("primary");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(name, color);
    setName("");
    setColor("primary");
    onHide();
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 200);
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add new column</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="py-4">
          <Form.Group className="mb-3">
            <Form.Control
              ref={titleInputRef}
              required
              type="text"
              placeholder="Enter column name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group>
            <Form.Select
              required
              value={color}
              onChange={(e) => setColor(e.target.value)}
            >
              <option value="primary">Blue</option>
              <option value="success">Green</option>
              <option value="warning">Yellow</option>
              <option value="danger">Red</option>
              <option value="info">Teal</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="success">
            Add Column
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
