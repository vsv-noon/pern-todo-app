import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('refresh_tokens', {
    id: { type: 'serial', primaryKey: true },
    user_id: { type: 'integer', references: 'users(id)', onDelete: 'CASCADE' },
    token_hash: { type: 'text', notNull: true },
    expires_at: { type: 'timestamptz', notNull: true },
    created_at: { type: 'timestamptz', default: pgm.func('now()') },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('refresh_tokens');
}
