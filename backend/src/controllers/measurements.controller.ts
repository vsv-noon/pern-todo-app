import type { Request, Response } from 'express';

import * as measurementsService from '../services/measurements.service.js';

export async function createMeasurement(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const measurements = await measurementsService.createNewMeasurement(req.user.userId, req.body);

    return res.status(201).json(measurements);
  } catch (err) {
    console.error('Failed add a Measurement', err);
    return res.status(500).json({ error: 'Failed add a Measurement' });
  }
}

export async function saveFullBodyMeasurementsController(req: Request, res: Response) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  console.log(req.body);
  try {
    const measured = await measurementsService.saveFullBodyMeasurements(req.user.userId, req.body);
    console.log(measured);

    if (
      !req.body.measurements ||
      !Array.isArray(req.body.measurements) ||
      req.body.measurements.length === 0
    ) {
      return res.status(400).json({ error: 'Measurements are required' });
    }

    return res.status(201).json(measured);
  } catch (err) {
    return res.status(500).json({ error: err || 'Failed to save measurements' });
  }
}
