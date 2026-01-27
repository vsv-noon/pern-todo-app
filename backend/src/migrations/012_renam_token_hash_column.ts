import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.renameColumn('refresh_tokens', 'token_hash', 'token');

  pgm.createConstraint('refresh_tokens', 'unique_token', {
    unique: 'token',
  });
}
