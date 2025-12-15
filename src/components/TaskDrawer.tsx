import { useState, useEffect, useRef } from "react";
import { type FormEvent } from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";
import type { Card } from "../types/index";
import ConfirmModal from "./ConfirmModal";
import { useBoardStore } from "../hooks/useBoardStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

type DrawerProps = {
  createTask: (colId: string, taskData: Partial<Card>) => void;
  editTask: (cardId: string, taskData: Partial<Card>) => void;
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
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { columns, fetchCardDetails, cardDetails, setCardDetails } =
    useBoardStore();
  const { isTaskDrawerOpen, closeTaskDrawer, activeCardId, activeColId } =
    useTaskDrawerStore();

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
  }, [activeCardId, fetchCardDetails, setCardDetails]);

  useEffect(() => {
    setCardForEdit();
    setColName(columns.find(({ id }) => id === cardDetails?.column_id)?.title);
  }, [cardDetails, columns]);

  useEffect(() => {
    setColName(columns.find(({ id }) => id === activeColId)?.title);
  }, [activeColId, columns]);

  const setCardForEdit = () => {
    setForm({
      title: cardDetails?.title || "",
      description: cardDetails?.description || "",
      priority: cardDetails?.priority || "",
    });
  };

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
  }, [isTaskDrawerOpen, setCardDetails]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (activeCardId) {
      editTask(activeCardId, {
        ...(form as Partial<Card>),
      });
    } else {
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

  return (
    <>
      <Offcanvas
        show={isTaskDrawerOpen}
        onHide={onCloseTaskDrawer}
        placement="end"
        backdrop={true}
        scroll={true}
        className="shadow-lg"
        style={{ width: "560px" }}
        data-bs-theme="dark"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-light d-flex align-items-center">
            {activeCardId ? "Edit card" : "Add card"}
            <span className="mx-2">{"→"}</span>
            <span>{colName}</span>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-3 mt-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Control
                ref={titleInputRef}
                required
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                type="text"
                placeholder="Task name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
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
                  onClick={onCloseTaskDrawer}
                >
                  Cancel
                </Button>
              </div>
              {activeCardId && (
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
        onHide={() => setConfirmDeleteShow(false)}
        onConfirm={handleDeleteCard}
        title="Delete this card?"
        message="This action permanently removes the selected task card. It cannot be undone."
        confirmBtnText="Delete"
      />
    </>
  );
}
