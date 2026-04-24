import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('refresh_tokens', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },
    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'CASCADE',
    },
    token: {
      type: 'text',
      notNull: true,
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true,
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    revoked_at: {
      type: 'timestamptz',
    },
  });

  pgm.createIndex('refresh_tokens', ['user_id'], {
    name: 'idx_refresh_tokens_user_id',
  });

  pgm.createIndex('refresh_tokens', ['token'], {
    name: 'idx_refresh_tokens_token',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('refresh_tokens');
}
