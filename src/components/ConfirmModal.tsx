import { Button, Modal } from "react-bootstrap";

type ConfirmModalProps = {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmBtnText: string;
  btnVariant?: string;
};

const ConfirmModal = ({
  show,
  onHide,
  onConfirm,
  title,
  message,
  confirmBtnText,
  btnVariant = "danger",
}: ConfirmModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered data-bs-theme="dark">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-muted">{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant={btnVariant} onClick={onConfirm}>
          {confirmBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
