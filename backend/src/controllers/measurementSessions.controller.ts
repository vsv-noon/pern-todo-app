import type { Request, Response } from 'express';

import * as measurementSessionsService from '../services/measurementSessions.service.js';

export async function getMeasurementSessionsController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const sessions = await measurementSessionsService.getMeasurementSessionsList(req.user.userId);

    return res.json(sessions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch Measurement Sessions' });
  }
}

export async function getMeasurementSessionByIdController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const session = await measurementSessionsService.getMeasurementSessionById(id, userId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    return res.status(200).json(session);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to fetch Measurement Session' });
  }
}

export async function updateMeasurementSessionByIdController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const id = Number(req.params.id);
    const userId = req.user.userId;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const updated = await measurementSessionsService.updateMeasurementSession(
      {
        sessionId: id,
        measurements: req.body.measurements,
        replaceAll: req.body.replaceAll,
      },
      userId
    );

    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update Measurement Session' });
  }
}
