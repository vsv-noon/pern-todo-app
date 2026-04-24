import type { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('users', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },
    email: {
      type: 'varchar(255)',
      unique: true,
      notNull: true,
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true,
    },
    name: {
      type: 'varchar(255)',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    is_activated: {
      type: 'boolean',
      notNull: true,
      default: false,
    },
  });
}
export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('users');
}
