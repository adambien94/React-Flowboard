import { useState, type FormEvent, useRef, useEffect } from "react";
import { Modal } from "react-bootstrap";

const COL_COLORS: { value: string; label: string; cssVar: string }[] = [
  { value: "secondary", label: "Gray", cssVar: "--fb-text-muted" },
  { value: "primary", label: "Purple", cssVar: "--fb-accent" },
  { value: "info", label: "Blue", cssVar: "--fb-blue" },
  { value: "success", label: "Green", cssVar: "--fb-green" },
  { value: "warning", label: "Amber", cssVar: "--fb-amber" },
  { value: "danger", label: "Red", cssVar: "--fb-red" },
];

type AddColumnModalProps = {
  show: boolean;
  onHide: () => void;
  onSave: (name: string, color: string) => void;
};

export default function AddColumnModal({
  show,
  onHide,
  onSave,
}: AddColumnModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>("secondary");
  const titleInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(name, color);
    setName("");
    setColor("secondary");
    onHide();
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 200);
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
          <span className="fb-modal-title">New column</span>
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
            <div className="fb-field-label">Column name</div>
            <input
              ref={titleInputRef}
              className="fb-field-control"
              required
              type="text"
              placeholder="e.g. In review"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="fb-field">
            <div className="fb-field-label">Color</div>
            <div
              className="fb-color-row"
              role="listbox"
              aria-label="Column color"
            >
              {COL_COLORS.map((c) => (
                <div
                  key={c.value}
                  role="option"
                  aria-selected={color === c.value}
                  title={c.label}
                  className={`fb-color-dot ${color === c.value ? "is-selected" : ""}`}
                  style={{ background: `var(${c.cssVar})` }}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
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
            Add column
          </button>
        </div>
      </form>
    </Modal>
  );
}
