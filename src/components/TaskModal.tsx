import { useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";

type TaskModalProps = {
  show: boolean;
  onHide: () => void;
};

export default function TaskModal({ show, onHide }: TaskModalProps) {
  const { activeCardId } = useTaskModalStore();
  const { fetchCardDetails, cardDetails, setCardDetails } = useBoardStore();

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
  }, [activeCardId, fetchCardDetails, setCardDetails]);

  useEffect(() => {
    if (!show) {
      const timeout = setTimeout(() => {
        setCardDetails(null);
      }, 250);

      return () => clearTimeout(timeout);
    }
  }, [show, setCardDetails]);

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
        <span className="fb-modal-title">Card details</span>
        <button type="button" className="fb-modal-close" onClick={onHide} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="fb-modal-body">
        {cardDetails ? (
          <>
            <div className="fb-field" style={{ gap: 8 }}>
              <div className="fb-field-label">Title</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fb-text)" }}>
                {cardDetails.title}
              </div>
            </div>

            <div className="fb-field" style={{ gap: 8 }}>
              <div className="fb-field-label">Description</div>
              <div style={{ fontSize: 13, color: "var(--fb-text-muted)", lineHeight: 1.5 }}>
                {cardDetails.description || "—"}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center" style={{ padding: "10px 0" }}>
            <Spinner data-testid="task-modal-spinner" />
          </div>
        )}
      </div>

      <div className="fb-modal-footer">
        <button type="button" className="fb-btn fb-btn-ghost" onClick={onHide} style={{ marginLeft: "auto" }}>
          Close
        </button>
      </div>
    </Modal>
  );
}
