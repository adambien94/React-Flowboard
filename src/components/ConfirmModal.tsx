import React from "react";
import { Button, Modal } from "react-bootstrap";

type ConfirmModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: () => void;
};

const ConfirmModal = ({ show, setShow, onConfirm }: ConfirmModalProps) => {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete this card?</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-muted">
        This action permanently removes the selected task card. It cannot be
        undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
