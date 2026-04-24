import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.noTransaction();

  // pgm.sql(`
  //   CREATE UNIQUE INDEX CONCURRENTLY idx_measurement_sessions_unique_day
  //   ON measurement_sessions (user_id, session_date, category)
  //    `);

  pgm.sql(`
    CREATE UNIQUE INDEX CONCURRENTLY idx_measurement_sessions_unique_day
    ON measurement_sessions (user_id, session_date, category)
    WHERE category = 'body';
    `);

  pgm.sql(`
    CREATE UNIQUE INDEX CONCURRENTLY idx_measurements_unique_day
    ON measurements (session_id, measurement_type_id);
    `);

  // CREATE UNIQUE INDEX CONCURRENTLY idx_measurements_unique_day
  // ON measurements (goal_id, CAST(measured_at AS DATE));
  // `);

  // pgm.createIndex('measurements', [{ name: 'goal_id' }, { name: 'measured_at' }], {
  //   unique: true,
  //   concurrently: true,
  //   name: 'idx_goal_measurements_unique_day',
  // });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.noTransaction();

  pgm.sql(`
    DROP INDEX CONCURRENTLY IF EXISTS idx_measurement_sessions_unique_day;
    `);

  pgm.sql(`
    DROP INDEX CONCURRENTLY IF EXISTS idx_measurements_unique_day;
    `);

  // pgm.dropIndex('measurements', ['goal_id', 'measured_at'], {
  //   concurrently: true,
  //   name: 'idx_goal_measurements_unique_day',
  // });
}
