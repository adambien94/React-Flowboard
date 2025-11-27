import { useState, type FormEvent, useRef, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const COL_COLORS = [
  { value: "primary", label: "Blue" },
  { value: "success", label: "Green" },
  { value: "warning", label: "Yellow" },
  { value: "danger", label: "Red" },
  { value: "info", label: "Teal" },
  { value: "secondary", label: "Grey" },
];

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
        <Modal.Body className="pt-4">
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
              {COL_COLORS.map((col) => (
                <option key={col.value} value={col.value}>
                  {col.label}
                </option>
              ))}
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
