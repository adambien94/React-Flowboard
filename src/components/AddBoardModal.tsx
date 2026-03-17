import { useEffect, useRef, useState, type FormEvent } from "react";
import { Modal } from "react-bootstrap";

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
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="fb-modal"
      backdropClassName="fb-modal-backdrop"
      data-bs-theme="dark"
    >
      <form onSubmit={handleSubmit}>
        <div className="fb-modal-header">
          <div className="fb-modal-icon">
            <i className="bi bi-plus-circle"></i>
          </div>
          <span className="fb-modal-title">New board</span>
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
          <div className="fb-field">
            <div className="fb-field-label">Board name</div>
            <input
              ref={inputRef}
              className="fb-field-control"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="Board name"
              required
              type="text"
            />
          </div>
        </div>

        <div className="fb-modal-footer">
          <button
            type="button"
            className="fb-btn fb-btn-ghost"
            onClick={onHide}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="fb-btn fb-btn-primary"
            style={{ marginLeft: "auto" }}
          >
            Create board
          </button>
        </div>
      </form>
    </Modal>
  );
}
