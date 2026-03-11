import { render, screen } from "@testing-library/react";
import TaskModal from "./TaskModal";
import { useTaskModalStore } from "../store/taskModalStore";
import { useBoardStore } from "../hooks/useBoardStore";

jest.mock("../store/taskModalStore");
jest.mock("../hooks/useBoardStore");

const mockedUseTaskModalStore = jest.mocked(useTaskModalStore);
const mockedUseBoardStore = jest.mocked(useBoardStore);

describe("TaskModal", () => {
  beforeEach(() => {
    mockedUseTaskModalStore.mockReturnValue({
      activeCardId: "card-1",
    });

    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails: jest.fn(),
      cardDetails: null,
      setCardDetails: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders a spinner when card details are loading", () => {
    render(<TaskModal show={true} onHide={jest.fn()} />);

    expect(
      screen.getByTestId("task-modal-spinner"),
    ).toBeInTheDocument();
  });

  it("renders card title and description when details are available", () => {
    const cardDetails = {
      id: "card-1",
      title: "Test card",
      description: "Test description",
      priority: "low",
    };

    mockedUseBoardStore.mockReturnValue({
      fetchCardDetails: jest.fn(),
      cardDetails,
      setCardDetails: jest.fn(),
    });

    render(<TaskModal show={true} onHide={jest.fn()} />);

    expect(screen.getByText(cardDetails.title)).toBeInTheDocument();
    expect(screen.getByText(cardDetails.description)).toBeInTheDocument();
  });
});

