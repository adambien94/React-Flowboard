import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddBoardModal from "./AddBoardModal";

describe("AddBoardModal", () => {
  it("calls onSave with trimmed board name on submit", async () => {
    const user = userEvent.setup();
    const handleSave = jest.fn();

    render(
      <AddBoardModal show={true} onHide={jest.fn()} onSave={handleSave} />,
    );

    const input = screen.getByPlaceholderText("Board name");
    await user.type(input, "  My board  ");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(handleSave).toHaveBeenCalledWith("My board");
  });

  it("does not call onSave when input is empty or whitespace", async () => {
    const user = userEvent.setup();
    const handleSave = jest.fn();

    render(
      <AddBoardModal show={true} onHide={jest.fn()} onSave={handleSave} />,
    );

    const input = screen.getByPlaceholderText("Board name");
    await user.type(input, "   ");
    await user.click(screen.getByRole("button", { name: /create/i }));

    expect(handleSave).not.toHaveBeenCalled();
  });
});

