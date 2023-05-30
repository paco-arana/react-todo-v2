import { render } from "@testing-library/react";
import App from "./App";

// Test used to learn the basics of JS testing.
// Checks that the title is present.
describe(App, () => {
  it("renders title", () => {
    const { getByTestId } = render(<App />);
    const titleValue = getByTestId("todo-title").textContent;
    expect(titleValue).toEqual("To Do App");
  });
});
