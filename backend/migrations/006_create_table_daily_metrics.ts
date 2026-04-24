import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('daily_metrics', {
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
    date: {
      type: 'date',
      notNull: true,
    },
    completed_count: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_count: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    productivity: {
      type: 'integer',
      notNull: true,
      default: 0,
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },
  });

  pgm.addConstraint('daily_metrics', 'daily_metrics_user_date_unique', {
    unique: ['user_id', 'date'],
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropConstraint('daily_metrics', 'daily_metrics_user_date_unique');
  pgm.dropTable('daily_metrics');
}
