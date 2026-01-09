import { describe, it, expect } from "vitest";
import { validateTodo } from "../validation";

describe("validateTodo", () => {
  it("returns error if title is empty", () => {
    expect(validateTodo("", "2026-01-10")).toBe("Title is required");
  });

  it("returns null for valid input", () => {
    expect(validateTodo("Buy milk", "2026-01-10")).toBeNull();
  });
});