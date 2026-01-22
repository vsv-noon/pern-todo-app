import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('daily_metrics', {
    date: { type: 'date', primaryKey: true },
    completed_count: { type: 'int', notNull: true },
    created_count: { type: 'int', notNull: true },
    productivity: { type: 'int', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('now()') },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('daily_metrics');
}
