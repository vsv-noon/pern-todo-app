import { pool } from '../config/db.js';
import * as measurementSessionsModel from '../models/measurementSessions.model.js';
import { UpdateSessionDTO } from '../types/measurementSession.types.js';

export async function getMeasurementSessionsList(userId: number) {
  return await measurementSessionsModel.getMeasurementSessions(userId);
}

export async function getMeasurementSessionById(sessionId: number, userId: number) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const session = measurementSessionsModel.getSessionById(client, sessionId, userId);

    if (!session) {
      throw new Error('Session not found');
    }
    await client.query('COMMIT');

    return session;
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

export async function updateMeasurementSession(dto: UpdateSessionDTO, userId: number) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const check = await client.query(
      `
      SELECT id FROM measurement_sessions
      WHERE id = $1
      AND user_id = $2
      `,
      [dto.sessionId, userId]
    );

    if (check.rowCount === 0) {
      throw new Error('Session not found');
    }

    await measurementSessionsModel.upsertMeasurement(client, dto.sessionId, dto.measurements);

    if (dto.replaceAll) {
      const names = dto.measurements.map((m) => m.name);

      if (names.length > 0) {
        await measurementSessionsModel.deleteMissingMeasurements(client, dto.sessionId, names);
      }
    }

    await client.query('COMMIT');

    return await measurementSessionsModel.getSessionById(client, dto.sessionId, userId);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
