import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('todos', {
    user_id: { type: 'integer', references: 'users(id)', onDelete: 'CASCADE' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('todos', 'user_id');
}
