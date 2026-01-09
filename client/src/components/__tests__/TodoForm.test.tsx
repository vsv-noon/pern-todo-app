import { describe, expect, it } from "vitest";
import { TodoForm } from "../TodoForm/TodoForm";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("validateTodoForm", () => {
  it("shows validation error if title is empty", async () => {
  render(<TodoForm refresh={() => {}} />);

  await userEvent.click(screen.getByText("Add"));

  expect(
    screen.getByText("Title is required")
  ).toBeInTheDocument();
});
})