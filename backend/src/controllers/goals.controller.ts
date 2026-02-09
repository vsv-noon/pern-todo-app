import type { Request, Response } from 'express';

import * as goalService from '../services/goals.service.js';

export async function createGoal(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // const goal = await goalService.createNewGoal(req.user?.userId, req.body);
    const goal = await goalService.createGoalWithTodos(req.user?.userId, req.body);
    res.status(201).json(goal);
  } catch (err) {
    console.error('Failed to delete goal', err);
    return res.status(500).json({ error: 'Failed to create goal' });
  }
}

export async function getGoals(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const goals = await goalService.getGoalsList(req.user?.userId);
    res.json(goals);
  } catch (err) {
    console.error('Failed to delete goal', err);
    return res.status(500).json({ error: 'Failed to fetch goal' });
  }
}

export async function deleteGoal(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.params;

  try {
    const deleted = await goalService.deleteGoalById(req.user.userId, Number(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Failed to delete goal', err);
    return res.status(500).json({ error: 'Failed to delete goal' });
  }
}

// export async function updateProgress(req: Request, res: Response) {
//   if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

//   try {
//     const goals = await goalService.completedTodoImpact(req.user?.userId);
//     res.json(goals);
//   } catch (err) {
//     console.error('Failed to delete goal', err);
//     return res.status(500).json({ error: 'Failed to update progress' });
//   }
// }
