import type { BoardColumn } from "../types/board";

export const mockBoard: BoardColumn[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    name: "Todo",
    color: "danger",
    cards: [
      {
        id: "f9e8d7c6-b5a4-3210-9876-543210fedcba",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
      {
        id: "12345678-90ab-cdef-1234-567890abcdef",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "LOW",
      },
      {
        id: "fedcba98-7654-3210-fedc-ba9876543210",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "MEDIUM",
      },
      {
        id: "fedcba98-7654-3210-fedc-ba9844443210",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "98765432-10fe-dcba-9876-543210fedcba",
    name: "In progress",
    color: "warning",
    cards: [
      {
        id: "abcdef12-3456-7890-abcd-ef1234567890",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "MEDIUM",
      },
      {
        id: "567890ab-cdef-1234-5678-90abcdef1234",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
      {
        id: "bcdef123-4567-890a-bcde-f12345678901",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "LOW",
      },
      {
        id: "cdef1234-5678-90ab-cdef-123456789012",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
    ],
  },
  {
    id: "def12345-6789-0abc-def1-234567890123",
    name: "Done",
    color: "success",
    cards: [
      {
        id: "ef123456-7890-abcd-ef12-345678901234",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
      {
        id: "01234567-89ab-cdef-0123-456789abcdef",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "LOW",
      },
      {
        id: "ef123456-7890-abcd-ef12-345671111234",
        title: "Create Your First Board",
        description:
          "Start by creating a new board to organize your tasks and projects.",
        priority: "HIGH",
      },
    ],
  },
];
