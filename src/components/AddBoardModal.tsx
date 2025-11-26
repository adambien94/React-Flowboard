import { useEffect, useRef, useState, type FormEvent } from "react";
import { Modal, Form, Button } from "react-bootstrap";

type AddBoardModalProps = {
  show: boolean;
  onHide: () => void;
  onSave: (name: string) => void;
};

export default function AddBoardModal({
  show,
  onHide,
  onSave,
}: AddBoardModalProps) {
  const [boardName, setBoardName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = boardName.trim();
    if (!trimmedName) return;
    onSave(trimmedName);
    setBoardName("");
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setBoardName("");
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create board</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              ref={inputRef}
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Board name"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button type="submit" variant="success">
            Create
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
