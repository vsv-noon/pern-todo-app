import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('measurement_sessions', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    session_date: {
      type: 'date',
      notNull: true,
    },
    recorded_at: {
      type: 'timestamptz',
      notNull: true,
    },
    category: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('measurement_sessions');
}
