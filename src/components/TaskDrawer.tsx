import { useState, useEffect, useRef } from "react";
import { type FormEvent } from "react";
import { Offcanvas, Form, Button } from "react-bootstrap";
import type { Card } from "../types/index";
import ConfirmModal from "./ConfirmModal";
import { useBoardStore } from "../hooks/useBoardStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

type DrawerProps = {
  colId: string;
  colName?: string;
  colColor?: string;
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
  colId,
  colName,
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
  const { fetchCardDetails, cardDetails, setCardDetails } = useBoardStore();
  const { isTaskDrawerOpen, closeTaskDrawer, activeCardId } =
    useTaskDrawerStore();

  useEffect(() => {
    if (activeCardId) fetchCardDetails(activeCardId);
  }, [activeCardId, fetchCardDetails, setCardDetails]);

  useEffect(() => {
    const setCardForEdit = () => {
      setForm({
        title: cardDetails?.title || "",
        description: cardDetails?.description || "",
        priority: cardDetails?.priority || "",
      });
    };
    setCardForEdit();
  }, [cardDetails]);

  const handleDeleteCard = () => {
    if (!activeCardId) return;
    deleteTask(activeCardId);
    closeTaskDrawer();
    setConfirmDeleteShow(false);
  };

  useEffect(() => {
    if (isTaskDrawerOpen) {
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
  }, [isTaskDrawerOpen]);

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
      createTask(colId, {
        ...(form as Partial<Card>),
      });
    }
    closeTaskDrawer();
  };

  return (
    <>
      <Offcanvas
        show={isTaskDrawerOpen}
        onHide={closeTaskDrawer}
        placement="end"
        backdrop={true}
        scroll={true}
        className="shadow-lg"
        style={{ width: "560px" }}
        data-bs-theme="dark"
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-light d-flex align-items-center">
            {activeCardId ? "Edit card" : "Add card"} - {colName}
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
                  onClick={closeTaskDrawer}
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
        setShow={setConfirmDeleteShow}
        onConfirm={handleDeleteCard}
        title="Delete this card?"
        message="This action permanently removes the selected task card. It cannot be undone."
        confirmBtnText="Delete"
      />
    </>
  );
}
