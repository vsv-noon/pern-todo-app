import request from "supertest";
import app from "../../src/app";

export async function createTodo(overrides = {}) {
  const res = await request(app)
    .post("/todos")
    .send({
      title: "Test todo",
      due_date: "2026-01-01",
      ...overrides,
    });

  return res;
}
