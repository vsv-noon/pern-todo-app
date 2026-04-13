import { Request, Response } from 'express';

import * as measurementTypesService from '../services/measurementTypes.service.js';

export async function getMeasurementTypesController(req: Request, res: Response) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

    const types = await measurementTypesService.getMeasurementTypes();
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch types' });
  }
}

export async function createMeasurementTypeController(req: Request, res: Response) {
  try {
    const result = await measurementTypesService.createMeasurementType(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

export async function updateMeasurementTypeController(req: Request, res: Response) {
  try {
    const result = await measurementTypesService.updateMeasurementType({
      id: Number(req.params.id),
      ...req.body,
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err });
  }
}

export async function deleteMeasurementTypeController(req: Request, res: Response) {
  try {
    await measurementTypesService.deleteMeasurementType(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ errorr: err });
  }
}
