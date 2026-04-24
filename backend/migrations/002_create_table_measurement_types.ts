import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('measurement_types', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },
    name: {
      type: 'text',
      notNull: true,
      unique: true,
    },
    label: {
      type: 'text',
    },
    unit: {
      type: 'text',
      notNull: true,
    },
    category: {
      type: 'text',
    },
    version: {
      type: 'integer',
    },
    is_system: {
      type: 'boolean',
    },
    is_active: {
      type: 'boolean',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('measurement_types');
}
