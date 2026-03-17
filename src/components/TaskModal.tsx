import { useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";
import formatTime from "../utils/formatTime";

type TaskModalProps = {
  show: boolean;
  onHide: () => void;
};

export default function TaskModal({ show, onHide }: TaskModalProps) {
  const { activeCardId } = useTaskModalStore();
  const { fetchCardDetails, cardDetails, setCardDetails } = useBoardStore();

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
    console.log(cardDetails);
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
        <div className="fb-modal-icon">
          <i className="bi bi-card-text"></i>
        </div>

        <span className="fb-modal-title">Card details</span>
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
        {cardDetails ? (
          <>
            <div className="fb-field" style={{ gap: 8 }}>
              <div>
                <i className="fb-field-label bi bi-text-left me-2"></i>
                <span className="fb-field-label">Title</span>
              </div>

              <div
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "var(--fb-text)",
                }}
              >
                {cardDetails.title}
              </div>
            </div>

            <div className="fb-field" style={{ gap: 8 }}>
              <div>
                <i className="fb-field-label bi bi-card-text me-2"></i>
                <span className="fb-field-label">Description</span>
              </div>

              <div
                style={{
                  fontSize: 14,
                  color: "var(--fb-text-muted)",
                  lineHeight: 1.5,
                  background: "var(--fb-bg3)",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--fb-border)",
                  padding: "12px",
                }}
              >
                {cardDetails.description || "—"}
              </div>
            </div>

            <div className="d-flex justify-content-between" style={{ gap: 8 }}>
              <div className="col">
                <div>
                  <span className="fb-field-label">Priority</span>
                </div>

                <div
                  className="fb-priority fb-priority-none mt-2"
                  style={{ display: "inline-block" }}
                >
                  {cardDetails.priority}
                </div>
              </div>
              <div className="col">
                <i className="fb-field-label bi bi-clock me-2"></i>
                <span className="fb-field-label">Time logged</span>

                <div
                  className="mt-1"
                  style={{
                    fontSize: "14px",
                    color: "var(--fb-text-muted)",
                    fontFamily:
                      '"DM Mono", ui-monospace, SFMono-Regular, Menlo, monospace',
                  }}
                >
                  {cardDetails.logged_time
                    ? formatTime(cardDetails.logged_time, true)
                    : "0h 0min "}
                </div>
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
        <button
          type="button"
          className="fb-btn fb-btn-ghost"
          title="Delete card"
        >
          <i className="bi bi-trash me-2"></i>
          Delete
        </button>
        <button
          type="button"
          className="fb-btn fb-btn-ghost"
          onClick={onHide}
          style={{ marginLeft: "auto" }}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
