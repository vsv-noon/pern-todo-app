import request from 'supertest';
import app from '../src/app.js';
import './setupDb.js';
import { createTodo } from './helpers/createTodo.js';

describe('Todos API', () => {
  it('creates todo', async () => {
    const res = await createTodo({
      title: 'Vitest todo',
      due_date: '2026-01-10',
    });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Vitest todo');
    expect(res.body.completed).toBe(false);
  });

  it('returns todos', async () => {
    const res = await request(app).get('/todos');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('rejects todo without title', async () => {
    const res = await createTodo({
      title: '',
      due_date: '2026-01-01',
    });

    expect(res.status).toBe(400);
  });

  it('updates todo', async () => {
    const create = await createTodo();

    const res = await request(app).patch(`/todos/${create.body.id}`).send({ completed: true });

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
  });

  it('deletes todo', async () => {
    const todo = await createTodo();

    const del = await request(app).delete(`/todos/${todo.body.id}`);

    expect(del.status).toBe(204);
  });

  it('does not return deleted todos', async () => {
    const todo = await createTodo();

    await request(app).delete(`/todos/${todo.body.id}`);

    const res = await request(app).get('/todos');

    expect(res.body.find((t) => t.id === todo.body.id)).toBeUndefined();
  });

  it('restores deleted todo', async () => {
    const todo = await createTodo();

    await request(app).delete(`/todos/${todo.body.id}`);

    const res = await request(app).patch(`/todos/${todo.body.id}/restore`).expect(200);

    expect(res.body.id).toBe(todo.body.id);
    expect(res.body.deleted_at).toBeNull();
  });

  it('cannot restore not deleted todo', async () => {
    const todo = await createTodo();

    await request(app).patch(`/todos/${todo.body.id}/restore`).expect(404);
  });
});
