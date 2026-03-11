import { render, screen, fireEvent } from "@testing-library/react";
import TaskCard from "./TaskCard";
import { useTimerStore } from "../store/timerStore";
import { useTaskModalStore } from "../store/taskModalStore";
import { useTaskDrawerStore } from "../store/taskDrawerStore";

jest.mock("../store/timerStore");
jest.mock("../store/taskModalStore");
jest.mock("../store/taskDrawerStore");
jest.mock("@dnd-kit/core", () => ({
  useDraggable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    isDragging: false,
  }),
}));

const mockedUseTimerStore = jest.mocked(useTimerStore);
const mockedUseTaskModalStore = jest.mocked(useTaskModalStore);
const mockedUseTaskDrawerStore = jest.mocked(useTaskDrawerStore);

const baseCard = {
  id: "card-1",
  title: "Test card",
  description: "Desc",
  priority: "low",
  logged_time: 0,
} as any;

describe("TaskCard", () => {
  beforeEach(() => {
    mockedUseTimerStore.mockReturnValue({
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      activeTaskId: null,
      isTimerShow: false,
      startTime: null,
      timeToLog: null,
      setTimeToLog: jest.fn(),
      clearActiveTaskId: jest.fn(),
    } as any);

    mockedUseTaskModalStore.mockReturnValue({
      openTaskModal: jest.fn(),
    } as any);

    mockedUseTaskDrawerStore.mockReturnValue({
      openTaskDrawer: jest.fn(),
    } as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("opens task modal when card is clicked", () => {
    render(<TaskCard card={baseCard} />);

    const { openTaskModal } = mockedUseTaskModalStore.mock.results[0].value;

    fireEvent.click(screen.getByText("Test card"));

    expect(openTaskModal).toHaveBeenCalledWith("card-1");
  });

  it("opens drawer when edit button is clicked", () => {
    render(<TaskCard card={baseCard} />);

    const { openTaskDrawer } = mockedUseTaskDrawerStore.mock.results[0].value;

    const buttons = screen.getAllByRole("button");
    const editButton = buttons[1];

    fireEvent.click(editButton);

    expect(openTaskDrawer).toHaveBeenCalledWith("card-1");
  });

  it("starts timer when no active task", () => {
    render(<TaskCard card={baseCard} />);

    const { startTimer } = mockedUseTimerStore.mock.results[0].value;

    const buttons = screen.getAllByRole("button");
    const timerButton = buttons[0];

    fireEvent.click(timerButton);

    expect(startTimer).toHaveBeenCalledWith("card-1");
  });

  it("stops timer when this card is active", () => {
    mockedUseTimerStore.mockReturnValueOnce({
      startTimer: jest.fn(),
      stopTimer: jest.fn(),
      activeTaskId: "card-1",
      isTimerShow: true,
      startTime: Date.now(),
      timeToLog: null,
      setTimeToLog: jest.fn(),
      clearActiveTaskId: jest.fn(),
    } as any);

    render(<TaskCard card={baseCard} />);

    const { stopTimer } = mockedUseTimerStore.mock.results[0].value;

    const buttons = screen.getAllByRole("button");
    const timerButton = buttons[0];

    fireEvent.click(timerButton);

    expect(stopTimer).toHaveBeenCalled();
  });
});

