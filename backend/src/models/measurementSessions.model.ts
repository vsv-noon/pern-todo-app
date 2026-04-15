import { PoolClient } from 'pg';

import { pool } from '../config/db.js';
import { Session } from '../types/measurements.types.js';

export async function getMeasurementSessions(userId: number) {
  const result = await pool.query(
    `
    SELECT * FROM measurement_sessions
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function createSession(
  client: PoolClient,
  { userId, sessionDate, category }: { userId: number; sessionDate: Date; category?: string }
): Promise<Session> {
  const res = await client.query(
    `
    INSERT INTO measurement_sessions (user_id, session_date, category)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, session_date, category)
    DO UPDATE SET session_date = EXCLUDED.session_date
    RETURNING id
    `,
    [userId, sessionDate, category]
  );

  return res.rows[0];
}

export async function getSessionById(client: PoolClient, sessionId: number, userId: number) {
  const result = await client.query(
    `
    SELECT
      s.id,
      s.user_id,
      s.session_date,
      s.category,
      json_agg(
        json_build_object(
          'type', t.name,
          'label', t.label,
          'unit', t.unit,
          'measured_value', m.measured_value
        )
        ORDER BY t.name
      ) AS measurements
    FROM measurement_sessions s
    LEFT JOIN measurements m ON m.session_id = s.id
    LEFT JOIN measurement_types t ON t.id = m.type_id
    WHERE s.id = $1 AND s.user_id = $2
    GROUP BY s.id
    `,
    [sessionId, userId]
  );

  return result.rows[0];
}

export async function upsertMeasurement(
  client: PoolClient,
  sessionId: number,
  measurements: { name: string; value: number }[]
) {
  await client.query(
    `
    INSERT INTO measurements (session_id, type_id, value)
    SELECT
      $1,
      t.id,
      v.value
    FROM jsonb_to_recordset($2::jsonb)
      AS v(name TEXT, value NUMERIC)
    JOIN measurement_types t on t.name = v.name
    ON CONFLICT (session_id, type_id)
    DO UPDATE SET value = EXCLUDED.value
    `,
    [sessionId, JSON.stringify(measurements)]
  );
}

export async function deleteMissingMeasurements(
  client: PoolClient,
  sessionId: number,
  names: string[]
) {
  await client.query(
    `
    DELETE FROM measurements m
    USING measurement_types t
    WHERE m.session_id = $1
      AND m.type_id = t.id
      AND t.name NOT IN (${names.map((_, i) => `$${i + 2}`).join(',')})
    `,
    [sessionId, ...names]
  );
}
