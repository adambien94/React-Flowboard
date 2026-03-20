import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskModal from "./TaskModal";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";
import { supabase } from "../api/supabaseClient";

jest.mock("../store/taskModalStore");
jest.mock("../hooks/useBoardStore");
jest.mock("../api/supabaseClient", () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

const mockedUseTaskModalStore = jest.mocked(useTaskModalStore);
const mockedUseBoardStore = jest.mocked(useBoardStore);
const mockedInvoke = jest.mocked(supabase.functions.invoke);

describe("TaskModal", () => {
  const fetchCardDetails = jest.fn();
  const setCardDetails = jest.fn();
  const updateCard = jest.fn();

  const cardDetails = {
    id: "card-1",
    title: "Test card",
    description: "Test description",
    priority: "low",
    logged_time: 125,
    taskSteps: ["Do something", "Do the next step"],
  };

  beforeEach(() => {
    mockedUseTaskModalStore.mockReturnValue({
      activeCardId: "card-1",
    });

    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails: null,
      setCardDetails,
      updateCard,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders a spinner when card details are loading", () => {
    render(<TaskModal show={true} onHide={jest.fn()} />);

    expect(
      screen.getByTestId("task-modal-spinner"),
    ).toBeInTheDocument();
  });

  it("fetches details and renders card values when available", () => {
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });

    render(<TaskModal show={true} onHide={jest.fn()} />);

    expect(fetchCardDetails).toHaveBeenCalledWith("card-1");
    expect(screen.getByText(cardDetails.title)).toBeInTheDocument();
    expect(screen.getByText(cardDetails.description)).toBeInTheDocument();
    expect(screen.getByText(/time logged/i)).toBeInTheDocument();
  });

  it("renders AI steps from taskSteps when provided", () => {
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });

    render(<TaskModal show={true} onHide={jest.fn()} />);

    expect(screen.getByText("Action steps (AI)")).toBeInTheDocument();
    expect(screen.getByText(cardDetails.taskSteps[0])).toBeInTheDocument();
    expect(screen.getByText(cardDetails.taskSteps[1])).toBeInTheDocument();
  });

  it("clears details shortly after the modal is hidden", () => {
    jest.useFakeTimers();
    render(<TaskModal show={false} onHide={jest.fn()} />);

    expect(setCardDetails).not.toHaveBeenCalled();
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(setCardDetails).toHaveBeenCalledWith(null);
  });

  it("generates steps and saves them after clicking Accept", async () => {
    const user = userEvent.setup();
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });
    mockedInvoke.mockResolvedValue({
      data: { steps: [" Step one ", "Step two", "", "Step three"] },
      error: null,
    } as never);

    render(<TaskModal show={true} onHide={jest.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /generate ai steps/i }),
    );

    expect(mockedInvoke).toHaveBeenCalledWith("generate-steps", {
      body: { title: cardDetails.title, description: cardDetails.description },
    });

    expect(await screen.findByRole("button", { name: /accept/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /accept/i }));

    await waitFor(() => {
      expect(updateCard).toHaveBeenCalledWith("card-1", {
        taskSteps: ["Step one", "Step two", "Step three"],
      });
    });
    expect(setCardDetails).toHaveBeenCalledWith({
      ...cardDetails,
      taskSteps: ["Step one", "Step two", "Step three"],
    });
  });

  it("shows an error when AI returns no valid steps", async () => {
    const user = userEvent.setup();
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });
    mockedInvoke.mockResolvedValue({
      data: { steps: [" ", "\n"] },
      error: null,
    } as never);

    render(<TaskModal show={true} onHide={jest.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /generate ai steps/i }),
    );

    expect(
      await screen.findByText(/AI did not return any steps\. Try again\./i),
    ).toBeInTheDocument();
  });

  it("shows an error when edge function invocation fails", async () => {
    const user = userEvent.setup();
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });
    mockedInvoke.mockResolvedValue({
      data: null,
      error: { message: "bad request" },
    } as never);

    render(<TaskModal show={true} onHide={jest.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /generate ai steps/i }),
    );

    expect(
      await screen.findByText(/Failed to generate steps for this task\./i),
    ).toBeInTheDocument();
  });

  it("shows thrown invocation errors and supports Reject", async () => {
    const user = userEvent.setup();
    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails,
      cardDetails,
      setCardDetails,
      updateCard,
    });
    mockedInvoke
      .mockResolvedValueOnce({
        data: { steps: ["first", "second"] },
        error: null,
      } as never)
      .mockRejectedValueOnce(new Error("boom"));

    render(<TaskModal show={true} onHide={jest.fn()} />);

    await user.click(
      screen.getByRole("button", { name: /generate ai steps/i }),
    );
    expect(await screen.findByRole("button", { name: /reject/i })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /reject/i }));
    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /reject/i })).not.toBeInTheDocument();
    });

    await user.click(
      screen.getByRole("button", { name: /generate ai steps/i }),
    );
    expect(
      await screen.findByText(/An error occurred while generating steps: boom/i),
    ).toBeInTheDocument();
  });
});

