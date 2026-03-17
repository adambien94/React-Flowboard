import { Modal } from "react-bootstrap";

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
  const confirmBtnClass =
    btnVariant === "success"
      ? "fb-btn fb-btn-success"
      : btnVariant === "danger"
        ? "fb-btn fb-btn-danger"
        : "fb-btn fb-btn-primary";

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="fb-modal"
      backdropClassName="fb-modal-backdrop"
      data-bs-theme="dark"
    >
      <div className="fb-modal-header">
        <div className="fb-modal-icon">
          <i className="bi bi-info-square"></i>
        </div>
        <span className="fb-modal-title">{title}</span>
        <button
          type="button"
          className="fb-modal-close"
          onClick={onHide}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div className="fb-modal-body">
        <div
          style={{
            fontSize: 14,
            color: "var(--fb-text-muted)",
            lineHeight: 1.5,
          }}
        >
          {message}
        </div>
      </div>

      <div className="fb-modal-footer">
        <button type="button" className="fb-btn fb-btn-ghost" onClick={onHide}>
          Cancel
        </button>
        <button
          type="button"
          className={confirmBtnClass}
          onClick={onConfirm}
          style={{ marginLeft: "auto" }}
        >
          {confirmBtnText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
