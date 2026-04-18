import { PoolClient } from 'pg';

// export async function getMeasurementsAnalytics(
//   client: PoolClient,
//   userId: number,
//   type: string,
//   from: string,
//   to: string
// ) {
//   const res = await client.query(
//     `
//     SELECT
//       t.name,
//       s.session_date AS date,
//       m.measured_value
//     FROM measurements m
//     JOIN measurement_sessions s ON s.id = m.session_id
//     JOIN measurement_types t ON t.id = m.measurement_type_id
//     WHERE
//       s.user_id = $1
//       AND t.name = $2
//       AND s.session_date BETWEEN $3 AND $4
//     ORDER BY t.name, s.session_date
//     `,
//     [userId, type, from, to]
//   );

//   return res.rows;
// }

export async function getMeasurementsAnalytics(
  client: PoolClient,
  userId: number,
  types: string[],
  from: string,
  to: string
) {
  const res = await client.query(
    `
    SELECT
      t.name,
      s.recorded_at AS date,
      m.measured_value
    FROM measurements m
    JOIN measurement_sessions s ON s.id = m.session_id
    JOIN measurement_types t ON t.id = m.measurement_type_id
    WHERE
      s.user_id = $1
      AND t.name = ANY($2)
      AND s.session_date BETWEEN $3 AND $4
    ORDER BY t.name, s.session_date, s.recorded_at
    `,
    [userId, types, from, to]
  );

  return res.rows;
}

export async function getGoalTargetValueByTypeName(
  client: PoolClient,
  name: string,
  userId: number
) {
  const result = await client.query(
    `
    SELECT g.target_value
    FROM measurement_types mt

    LEFT JOIN goals g
      ON g.measurement_type_id= mt.id
    WHERE mt.name = $1 AND g.user_id = $2   
    `,
    [name, userId]
  );

  return result.rows[0];
}
