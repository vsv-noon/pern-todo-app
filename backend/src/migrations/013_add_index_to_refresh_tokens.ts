import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createIndex('refresh_tokens', ['user_id'], {
    name: 'idx_refresh_tokens_user_id',
  });

  pgm.createIndex('refresh_tokens', ['token'], {
    name: 'idx_refresh_tokens_token',
  });
}
