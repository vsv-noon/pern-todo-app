import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('refresh_tokens', {
    revoked_at: { type: 'timestamptz' },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('refresh_tokens', 'revoked_at');
}
