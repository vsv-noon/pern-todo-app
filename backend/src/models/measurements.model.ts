import { PoolClient } from 'pg';

import { pool } from '../config/db.js';
import { Session, MeasurementRow, MeasurementsRow } from '../types/measurements.types.js';

export async function createGoalMeasurement(userId: number, data: MeasurementsRow) {
  const { type_id, goal_id, measured_value, note, measured_at } = data;

  const result = await pool.query(
    `
    INSERT INTO measurements (type_id, goal_id, user_id, measured_value, note, measured_at)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (type_id, DATE(measured_at)) DO UPDATE SET
      measured_value = EXCLUDED.measured_value,
      note = EXCLUDED.note,
      measured_at = EXCLUDED.measured_at
    RETURNING *
    `,
    [type_id, goal_id, userId, measured_value, note, measured_at]
  );

  await pool.query(
    `
    UPDATE goals
    SET current_value = $1
    WHERE id = $2 AND goal_type = 'metric'
    `,
    [measured_value, goal_id]
  );

  return result.rows[0];
}

export async function createSession(
  client: PoolClient,
  { userId, measuredAt, comment }: { userId: number; measuredAt: Date; comment?: string }
): Promise<Session> {
  const res = await client.query(
    `
    INSERT INTO measurement_sessions (user_id, measured_at, comment)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [userId, measuredAt, comment || null]
  );

  return res.rows[0];
}

export async function upsertMeasurementTypes(client: PoolClient, typeNames: string[]) {
  if (typeNames.length === 0) return;

  const values = typeNames.map((_, i) => `($${i + 1}, 'cm')`).join(',');

  await client.query(
    `
    INSERT INTO measurement_types (name, unit)
    VALUES ${values}
    ON CONFLICT (name) DO NOTHING
    `,
    typeNames
  );
}

export async function getMeasurementTypesMap(client: PoolClient, typeNames: string[]) {
  const res = await client.query(
    `
    SELECT id, name
    FROM measurement_types
    WHERE name = ANY($1)
    `,
    [typeNames]
  );

  const map: Record<string, number> = {};
  for (const row of res.rows) {
    map[row.name] = row.id;
  }

  return map;
}

export async function insertMeasurements(
  client: PoolClient,
  rows: MeasurementRow[]
): Promise<void> {
  if (rows.length === 0) return;
  const values: unknown[] = [];
  const placeholders: string[] = [];

  rows.forEach((row, i) => {
    const base = i * 5;

    placeholders.push(`($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5})`);
    values.push(row.userId, row.typeId, row.sessionId, row.measuredValue, row.measuredAt);
  });

  await client.query(
    `
    INSERT INTO measurements (user_id, type_id, session_id, measured_value, measured_at)
    VALUES ${placeholders.join(',')}
    ON CONFLICT (type_id, DATE(measured_at)) DO UPDATE
    SET
      measured_value = EXCLUDED.measured_value,
      note = EXCLUDED.note,
      measured_at = EXCLUDED.measured_at
    RETURNING *
    `,
    values
  );
}
