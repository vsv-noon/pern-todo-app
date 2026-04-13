import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('measurements', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    type_id: {
      type: 'integer',
      notNull: true,
      references: 'measurement_types',
      onDelete: 'CASCADE',
    },
    goal_id: {
      type: 'integer',
      // notNull: true,
      references: 'goals',
      onDelete: 'CASCADE',
    },
    session_id: {
      type: 'integer',
      references: 'measurement_sessions',
      onDelete: 'SET NULL',
    },
    measured_value: {
      type: 'numeric(10, 2)',
      notNull: true,
      check: 'measured_value >= 0',
    },
    measured_at: {
      type: 'date',
    },
    note: {
      type: 'text',
    },
    metadata: {
      type: 'JSONB',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('measurements');
}
