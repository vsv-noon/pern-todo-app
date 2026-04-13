import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.noTransaction();

  pgm.sql(`
    CREATE UNIQUE INDEX CONCURRENTLY idx_measurements_unique_day
    ON measurements (type_id, CAST(measured_at AS DATE));
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
    DROP INDEX CONCURRENTLY IF EXISTS idx_measurements_unique_day;
    `);

  // pgm.dropIndex('measurements', ['goal_id', 'measured_at'], {
  //   concurrently: true,
  //   name: 'idx_goal_measurements_unique_day',
  // });
}
