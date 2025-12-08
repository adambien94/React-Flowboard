import { Button, Modal } from "react-bootstrap";

type ConfirmModalProps = {
  show: boolean;
  setShow: (show: boolean) => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmBtnText: string;
};

const ConfirmModal = ({
  show,
  setShow,
  onConfirm,
  title,
  message,
  confirmBtnText,
}: ConfirmModalProps) => {
  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      data-bs-theme="dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-muted">{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => setShow(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {confirmBtnText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
