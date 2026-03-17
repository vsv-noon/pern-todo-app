import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn('goals', 'target_value', { type: 'numeric' });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.alterColumn('goals', 'target_value', { type: 'integer' });
}
