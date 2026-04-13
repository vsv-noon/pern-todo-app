import { pool } from '../config/db.js';
import {
  CreateMeasurementTypeDTO,
  MeasurementType,
  UpdateMeasurementTypeDTO,
} from '../types/measurementTypes.types.js';
import * as measurementTypesModel from '../models/measurementTypes.model.js';

export async function getMeasurementTypes(): Promise<MeasurementType[]> {
  const client = await pool.connect();

  try {
    return await measurementTypesModel.getAll(client);
  } finally {
    client.release();
  }
}

export async function createMeasurementType(dto: CreateMeasurementTypeDTO) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const result = await measurementTypesModel.create(client, dto);

    await client.query('COMMIT');

    return result;
  } catch (err: any) {
    await client.query('ROLLBACK');

    if (err.code === '23505') {
      throw new Error('Measurement type type already exists');
    }

    throw err;
  } finally {
    client.release();
  }
}

export async function updateMeasurementType(
  dto: UpdateMeasurementTypeDTO
): Promise<MeasurementType> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const updated = await measurementTypesModel.update(client, dto.id, dto);

    if (!updated) {
      throw new Error('Measurement type not found');
    }

    await client.query('COMMIT');

    return updated;
  } catch (err: any) {
    await client.query('ROLLBACK');

    if (err.code === '23505') {
      throw new Error('Duplicate name');
    }

    throw err;
  } finally {
    client.release();
  }
}

export async function deleteMeasurementType(id: number): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const ok = await measurementTypesModel.remove(client, id);

    if (!ok) {
      throw new Error('Measurement type not found');
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
