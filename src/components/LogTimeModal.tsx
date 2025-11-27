import React from "react";
import { Button, Modal } from "react-bootstrap";

type LogTimeModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: () => void;
};

const LogTimeModal = ({ show, setShow, onConfirm }: LogTimeModalProps) => {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Log time</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-muted">
        Do yout want to log time in 'Testowy task yolo'?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="success" onClick={onConfirm}>
          Log Time
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogTimeModal;
