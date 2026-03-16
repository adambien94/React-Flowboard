import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type FormEvent,
} from "react";
import { Offcanvas } from "react-bootstrap";
import type { Card } from "../types/index";
import ConfirmModal from "./ConfirmModal";
import { useBoardStore } from "../hooks/useBoardStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";
import formatTime from "../utils/formatTime";

type DrawerProps = {
  createTask: (colId: string, taskData: Partial<Card>) => Promise<void>;
  editTask: (cardId: string, taskData: Partial<Card>) => Promise<void>;
  deleteTask: (cardId: string) => void;
};

type TaskForm = {
  title: string;
  description: string;
  priority: string;
};

const TASK_PRIORITIES = [
  {
    label: "Priority",
    value: "",
  },
  {
    label: "Low",
    value: "low",
  },
  {
    label: "Medium",
    value: "medium",
  },
  {
    label: "High",
    value: "high",
  },
];

export default function Drawer({
  createTask,
  editTask,
  deleteTask,
}: DrawerProps) {
  const [form, setForm] = useState<TaskForm>({
    title: "",
    description: "",
    priority: "",
  });
  const [confirmDeleteShow, setConfirmDeleteShow] = useState(false);
  const [colName, setColName] = useState<string | undefined>("");
  const [initialColumnId, setInitialColumnId] = useState<string | null>(null);
  const [selectedColumnId, setSelectedColumnId] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { columns, fetchCardDetails, cardDetails, setCardDetails, moveCard } =
    useBoardStore();
  const { isTaskDrawerOpen, closeTaskDrawer, activeCardId, activeColId } =
    useTaskDrawerStore();

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
  }, [activeCardId, fetchCardDetails]);

  const setCardForEdit = useCallback(() => {
    setForm({
      title: cardDetails?.title || "",
      description: cardDetails?.description || "",
      priority: cardDetails?.priority || "",
    });
  }, [cardDetails]);

  useEffect(() => {
    setCardForEdit();
    const currentColId = cardDetails?.column_id ?? null;
    setInitialColumnId(currentColId);
    setSelectedColumnId(currentColId);
    setColName(columns.find(({ id }) => id === currentColId)?.title);
  }, [cardDetails, columns, setCardForEdit]);

  useEffect(() => {
    if (!activeCardId) {
      setSelectedColumnId(activeColId ?? null);
      setColName(columns.find(({ id }) => id === activeColId)?.title);
    }
  }, [activeColId, activeCardId, columns]);

  const handleDeleteCard = () => {
    if (!activeCardId) return;
    deleteTask(activeCardId);
    onCloseTaskDrawer();
    setConfirmDeleteShow(false);
  };

  useEffect(() => {
    if (isTaskDrawerOpen) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 200);
    }
  }, [isTaskDrawerOpen]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (activeCardId) {
      await editTask(activeCardId, {
        ...(form as Partial<Card>),
      });

      if (
        selectedColumnId &&
        selectedColumnId !== initialColumnId &&
        selectedColumnId !== cardDetails?.column_id
      ) {
        await moveCard(activeCardId, selectedColumnId, 0);
      }
    } else if (activeColId) {
      createTask(activeColId, {
        ...(form as Partial<Card>),
      });
    }
    onCloseTaskDrawer();
  };

  const onCloseTaskDrawer = () => {
    closeTaskDrawer();
    setTimeout(() => {
      setCardDetails(null);
    }, 250);
  };

  const prioColor = (prio: string) => {
    switch (prio) {
      case "high":
        return "var(--fb-red)";
      case "medium":
        return "var(--fb-amber)";
      case "low":
        return "var(--fb-green)";
      default:
        return "var(--fb-text-faint)";
    }
  };

  const timerValue = (() => {
    const raw = cardDetails?.logged_time ?? 0;
    const hhmmss = formatTime(raw);
    // show mm:ss when hours are 00, else show hh:mm:ss
    return hhmmss.startsWith("00:") ? hhmmss.slice(3) : hhmmss;
  })();

  const handleMoveColumnSelect = (toColumnId: string) => {
    if (!toColumnId) return;
    setSelectedColumnId(toColumnId);
  };

  return (
    <>
      <Offcanvas
        show={isTaskDrawerOpen}
        onHide={onCloseTaskDrawer}
        placement="end"
        backdrop={true}
        scroll={true}
        className="shadow-lg fb-task-drawer"
        data-bs-theme="dark"
      >
        <div className="fb-drawer-header">
          <span className="fb-drawer-arrow">
            {activeCardId ? "Edit card" : "Add card"}
          </span>
          <span style={{ color: "var(--fb-text-faint)", fontSize: 13 }}>→</span>
          <span className="fb-drawer-col-pill">{colName || "Column"}</span>
          <button
            type="button"
            className="fb-modal-close"
            onClick={onCloseTaskDrawer}
            aria-label="Close"
            style={{ marginLeft: "auto" }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            minHeight: 0,
          }}
        >
          <div className="fb-drawer-body">
            <div className="fb-field">
              <div className="fb-field-label">Title</div>
              <input
                ref={titleInputRef}
                className="fb-field-control"
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                type="text"
                placeholder="Task name"
              />
            </div>

            <div className="fb-field">
              <div className="fb-field-label">Description</div>
              <textarea
                className="fb-field-control"
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={6}
                placeholder="Add a description"
              />
            </div>

            <div className="fb-field">
              <div className="fb-field-label">Priority</div>
              <div className="fb-priority-select-wrap">
                <div
                  className="fb-priority-indicator"
                  style={{ background: prioColor(form.priority) }}
                />
                <select
                  className="fb-field-control has-indicator"
                  value={form.priority}
                  onChange={(e) => handleChange("priority", e.target.value)}
                >
                  {TASK_PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {activeCardId && columns.length > 1 && (
              <div className="fb-field">
                <div className="fb-field-label">Move to column</div>
                <select
                  className="fb-field-control"
                  value={selectedColumnId || ""}
                  onChange={(e) => handleMoveColumnSelect(e.target.value)}
                >
                  {columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {activeCardId && (
              <div>
                <div
                  className="fb-section-divider"
                  style={{ marginBottom: 12 }}
                >
                  Time tracked
                </div>
                <div className="fb-timer-row">
                  <div>
                    <div className="fb-timer-val">{timerValue}</div>
                    <div className="fb-timer-label">minutes logged</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="fb-drawer-footer">
            <button type="submit" className="fb-btn fb-btn-primary">
              Save Card
            </button>
            <button
              type="button"
              className="fb-btn fb-btn-ghost"
              onClick={onCloseTaskDrawer}
            >
              Cancel
            </button>
            {activeCardId && (
              <button
                type="button"
                className="fb-btn fb-btn-danger"
                onClick={() => setConfirmDeleteShow(true)}
                title="Delete card"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </Offcanvas>

      <ConfirmModal
        show={confirmDeleteShow}
        onHide={() => setConfirmDeleteShow(false)}
        onConfirm={handleDeleteCard}
        title="Delete this card?"
        message="This action permanently removes the selected task card. It cannot be undone."
        confirmBtnText="Delete"
      />
    </>
  );
}
