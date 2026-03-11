import { render, screen, fireEvent } from "@testing-library/react";
import TaskDrawer from "./TaskDrawer";
import { useBoardStore } from "../hooks/useBoardStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

jest.mock("../hooks/useBoardStore");
jest.mock("../store/taskDrawerStore");

const mockedUseBoardStore = jest.mocked(useBoardStore);
const mockedUseTaskDrawerStore = jest.mocked(useTaskDrawerStore);

const baseBoardStore = {
  columns: [],
  fetchCardDetails: jest.fn(),
  cardDetails: null,
  setCardDetails: jest.fn(),
} as any;

const baseDrawerStore = {
  isTaskDrawerOpen: true,
  activeCardId: null,
  activeColId: "col-1",
  closeTaskDrawer: jest.fn(),
} as any;

const setup = (overrides?: {
  board?: Partial<typeof baseBoardStore>;
  drawer?: Partial<typeof baseDrawerStore>;
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
    fireEvent.change(screen.getByDisplayValue("Priority"), {
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

