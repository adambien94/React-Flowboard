import { useState, useEffect, useRef, useCallback } from "react";
import { type FormEvent } from "react";
import { Offcanvas, Form, Button, Badge, Modal } from "react-bootstrap";
import type { BoardColumnCard, RawBoardColumnCard } from "../types/board";
import { v4 as uuidV4 } from "uuid";
import { useBoardContext } from "../contexts/BoardContext";
import ConfirmModal from "./ConfirmModal";

type DrawerProps = {
  colId: string;
  colName?: string;
  colColor?: string;
  onHide: () => void;
  createTask: (colId: string, taskData: BoardColumnCard) => void;
  editTask: (
    colId: string,
    cardId: string,
    taskData: RawBoardColumnCard
  ) => void;
  deleteTask: (colId: string, cardId: string) => void;
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
    value: "LOW",
  },
  {
    label: "Medium",
    value: "MEDIUM",
  },
  {
    label: "High",
    value: "HIGH",
  },
];

export default function Drawer({
  onHide,
  colId,
  colName,
  colColor,
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
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { boardCols, drawerShow } = useBoardContext();

  const getCardIdFromHash = () => {
    const hash = window.location.hash;
    if (hash.includes("#edit=")) {
      return hash.split("#edit=")[1];
    }
    return null;
  };

  const setCardForEdit = useCallback(() => {
    const cardId = getCardIdFromHash();
    if (cardId) {
      const cardForEdit = boardCols
        .find(({ id }) => id === colId)
        ?.cards.find(({ id }) => id === cardId);

      if (cardForEdit) {
        setForm({
          title: cardForEdit.title,
          description: cardForEdit.description,
          priority: cardForEdit.priority,
        });
      }
    }
  }, [boardCols, colId]);

  const handleDeleteCard = () => {
    const cardId = getCardIdFromHash();
    if (!cardId) return;
    deleteTask(colId, cardId);
    onHide();
    setConfirmDeleteShow(false);
  };

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("#edit=")) {
      setCardForEdit();
    }
    if (drawerShow) {
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 200);
    } else {
      setForm({
        title: "",
        description: "",
        priority: "",
      });
    }
  }, [drawerShow, setCardForEdit]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cardId = getCardIdFromHash();

    if (cardId) {
      editTask(colId, cardId, {
        ...form,
      });
    } else {
      createTask(colId, {
        id: uuidV4(),
        ...form,
      });
    }
    onHide();
  };

  return (
    <>
      <Offcanvas
        show={drawerShow}
        onHide={onHide}
        placement="end"
        backdrop={true}
        scroll={true}
        className="shadow-lg"
        style={{ width: "560px" }}
        data-bs-theme="dark"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-light d-flex align-items-center">
            {getCardIdFromHash() ? "Edit card" : "Add card"} - {colName}
            {/* <span className="fs-6 mb-1">
              <Badge bg={colColor} className="mx-2">
                {colName}
              </Badge>
            </span> */}
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-3 mt-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                ref={titleInputRef}
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                type="text"
                placeholder="Task name"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Control
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                as="textarea"
                rows={8}
                placeholder="Add a description"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Select
                required
                value={form.priority}
                onChange={(e) => handleChange("priority", e.target.value)}
              >
                {TASK_PRIORITIES.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2 justify-content-between mt-4">
              <div>
                <Button variant="success" type="submit" className="me-2">
                  Save Card
                </Button>
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={onHide}
                >
                  Cancel
                </Button>
              </div>
              {getCardIdFromHash() && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setConfirmDeleteShow(true)}
                >
                  <i className="bi bi-trash" />
                </Button>
              )}
            </div>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <ConfirmModal
        show={confirmDeleteShow}
        setShow={setConfirmDeleteShow}
        onConfirm={handleDeleteCard}
        title="Delete this card?"
        message="This action permanently removes the selected task card. It cannot be undone."
        confirmBtnText="Delete"
      />
    </>
  );
}
