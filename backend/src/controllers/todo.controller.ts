import type { Request, Response } from 'express';

import * as todoService from '../services/todo.service.js';

export async function createTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { title, description, due_date, remind_at, priority } = req.body;

  if (!title || !due_date) {
    return res.status(400).json({ error: 'Title and due_date required' });
  }

  try {
    const todo = await todoService.createTodoItem(req.user.userId, {
      title,
      description,
      due_date,
      remind_at,
      priority,
    });
    return res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to create todo' });
  }
}

export async function updateTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;
  const updates = req.body;

  try {
    const todo = await todoService.updateTodoItem(req.user.userId, Number(id), updates);
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.json(todo);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update todo' });
  }
}

export async function getTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { date, search, status } = req.query as {
    date?: string;
    search?: string;
    status?: 'all' | 'completed' | 'active';
  };

  const filters: {
    date?: string;
    search?: string;
    status: 'all' | 'completed' | 'active';
  } = { status: 'all' };

  if (date) filters.date = date;
  if (search) filters.search = search;
  if (status && status !== 'all') filters.status = status;

  try {
    const todos = await todoService.getTodoList(req.user.userId, filters);

    return res.json(todos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch todos' });
  }
}

export async function getCalendarCounts(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const counts = await todoService.getCalendarTodoCounts(req.user.userId);
    return res.json(counts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch calendar counts' });
  }
}

export async function getTitleSuggestions(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { query } = req.query as { query?: string };

  try {
    const suggestions = await todoService.getTodoSuggestions(req.user.userId, query ?? '');
    return res.json(suggestions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch suggestions' });
  }
}

export async function getDeletedTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { query } = req.query as { query?: string };

  try {
    const todos = await todoService.getDeletedTodoList(req.user.userId, query ?? undefined);
    return res.json(todos);
  } catch (err) {
    console.error('Failed to fetch deleted todos', err);
    return res.status(500).json({ error: 'Failed to fetch deleted todos' });
  }
}

export async function deleteTodo(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;

  try {
    const deleted = await todoService.deleteTodoItem(req.user.userId, Number(id));
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Failed to delete todo', err);
    return res.status(500).json({ error: 'Failed to delete todo' });
  }
}

export async function bulkRestoreTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { ids } = req.body as { ids: number[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array required' });
  }

  try {
    const restored = await todoService.restoreDeletedTodos(req.user.userId, ids);
    return res.json({ restored });
  } catch (err) {
    console.error('Bulk restore failed', err);
    return res.status(500).json({ error: 'Bulk restore failed' });
  }
}

export async function bulkHardRDeleteTodos(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { ids } = req.body as { ids: number[] };

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'ids array required' });
  }

  try {
    const deleted = await todoService.hardDeleteTodos(req.user.userId, ids);
    return res.json({ deleted });
  } catch (err) {
    console.error('Bulk delete failed', err);
    return res.status(500).json({ error: 'Bulk delete failed' });
  }
}
