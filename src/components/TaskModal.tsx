import { Modal, Button } from "react-bootstrap";

type TaskModalProps = {
  show: boolean;
  onHide: () => void;
};

export default function TaskModal({ show, onHide }: TaskModalProps) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{ borderBottom: "none" }}
        className="pt-4"
      ></Modal.Header>
      <Modal.Body className="pt-0 text-muted">
        <h3>Współdzielony stan między przeglądarkami</h3>

        <p className="mt-4">
          Supabase Realtime to WebSocketowy stream zmian z PostgreSQL, który
          wysyła do Twojej aplikacji.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
