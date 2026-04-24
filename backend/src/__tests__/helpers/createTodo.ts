import request from 'supertest';

import { app } from '../../app.js';

export async function createTask(overrides = {}) {
  const res = await request(app)
    .post('/tasks')
    .send({
      title: 'Test task',
      due_date: '2026-01-01',
      ...overrides,
    });

  return res;
}
