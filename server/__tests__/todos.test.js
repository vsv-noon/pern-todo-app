import request from "supertest";
import app from "../src/app.js";
import "./setupDb.js";

describe("Todos API", () => {
  it("creates todo", async () => {
    const res = await request(app).post("/todos").send({
      title: "Vitest todo",
      due_date: "2026-01-10",
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Vitest todo");
    expect(res.body.completed).toBe(false);
  });

  it("returns todos", async () => {
    const res = await request(app).get("/todos");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("updates todo", async () => {
    const create = await request(app).post("/todos").send({ title: "Old" });

    const res = await request(app)
      .put(`/todos/${create.body.id}`)
      .send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it("deletes todo", async () => {
    const create = await request(app)
      .post("/todos")
      .send({ title: "Delete me" });

    const del = await request(app).delete(`/todos/${create.body.id}`);

    expect(del.status).toBe(204);
  });
});
