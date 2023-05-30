import { render, fireEvent } from "@testing-library/react";
import AddTodo from "../components/AddTodo";

// Checks that the background is greyed out after clicking add button
describe("AddTodo", () => {
  it("displays modal when 'add' button is clicked", () => {
    const { getByText, getByTestId } = render(<AddTodo />);

    const addButton = getByText("+ Add New To Do");
    fireEvent.click(addButton);

    const modal = getByTestId("todo-modal");

    expect(modal).toBeInTheDocument();
  });
});
