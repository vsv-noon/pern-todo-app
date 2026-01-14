import { z } from 'zod';

export const createTodoSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().max(500).optional(),
  due_date: z.string().refine((value) => !isNaN(Date.parse(value)), 'Invalid due date'),
});

export const updateTodoSchema = z
  .object({
    title: z.string().min(2).optional(),
    description: z.string().max(500).optional(),
    completed: z.boolean().optional(),
    due_date: z.string().optional(),
    remind_at: z.string().nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'Nothing to update');
