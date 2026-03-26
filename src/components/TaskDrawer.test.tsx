import { render, screen, fireEvent } from "@testing-library/react";
import TaskDrawer from "./TaskDrawer";
import { useBoardStore } from "../store/useBoardStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

jest.mock("../store/useBoardStore");
jest.mock("../store/taskDrawerStore");

const mockedUseBoardStore = jest.mocked(useBoardStore);
const mockedUseTaskDrawerStore = jest.mocked(useTaskDrawerStore);

type BoardStoreMock = {
  columns: unknown[];
  fetchCardDetails: jest.Mock;
  cardDetails: unknown;
  setCardDetails: jest.Mock;
};

type DrawerStoreMock = {
  isTaskDrawerOpen: boolean;
  activeCardId: string | null;
  activeColId: string | null;
  closeTaskDrawer: jest.Mock;
};

const baseBoardStore: BoardStoreMock = {
  columns: [],
  fetchCardDetails: jest.fn(),
  cardDetails: null,
  setCardDetails: jest.fn(),
};

const baseDrawerStore: DrawerStoreMock = {
  isTaskDrawerOpen: true,
  activeCardId: null,
  activeColId: "col-1",
  closeTaskDrawer: jest.fn(),
};

const setup = (overrides?: {
  board?: Partial<BoardStoreMock>;
  drawer?: Partial<DrawerStoreMock>;
}) => {
  mockedUseBoardStore.mockReturnValue({
    ...baseBoardStore,
    ...(overrides?.board ?? {}),
  });

  mockedUseTaskDrawerStore.mockReturnValue({
    ...baseDrawerStore,
    ...(overrides?.drawer ?? {}),
  });

  const createTask = jest.fn();
  const editTask = jest.fn();
  const deleteTask = jest.fn();

  render(
    <TaskDrawer
      createTask={createTask}
      editTask={editTask}
      deleteTask={deleteTask}
    />,
  );

  return { createTask, editTask, deleteTask };
};

describe("TaskDrawer", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("creates task when no activeCardId", () => {
    const { createTask } = setup();

    fireEvent.change(screen.getByPlaceholderText("Task name"), {
      target: { value: "New task" },
    });
    fireEvent.change(screen.getByPlaceholderText("Add a description"), {
      target: { value: "Desc" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "low" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save card/i }));

    expect(createTask).toHaveBeenCalledWith(
      "col-1",
      expect.objectContaining({
        title: "New task",
        description: "Desc",
        priority: "low",
      }),
    );
  });

  it("edits task when activeCardId is set", () => {
    const cardDetails = {
      id: "card-1",
      title: "Existing",
      description: "Old",
      priority: "medium",
      column_id: "col-1",
    };

    const { editTask } = setup({
      board: { cardDetails },
      drawer: { activeCardId: "card-1" },
    });

    expect(
      screen.getByDisplayValue(cardDetails.title),
    ).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("Task name"), {
      target: { value: "Updated" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save card/i }));

    expect(editTask).toHaveBeenCalledWith(
      "card-1",
      expect.objectContaining({
        title: "Updated",
      }),
    );
  });
});

