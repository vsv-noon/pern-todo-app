import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: { type: 'serial', primaryKey: true },
    email: { type: 'text', unique: true, notNull: true },
    password_hash: { type: 'text', notNull: true },
    name: { type: 'text' },
    created_at: { type: 'timestamptz', default: pgm.func('now()') },
  });
}
export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
