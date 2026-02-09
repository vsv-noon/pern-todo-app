import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('goals', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: 'users',
      onDelete: 'CASCADE',
    },
    title: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    current_value: {
      type: 'integer',
      default: 0,
    },
    target_value: {
      type: 'integer',
      notNull: true,
    },
    target_type: {
      type: 'text',
    },
    tasks_count: {
      type: 'integer',
    },
    until_date: {
      type: 'date',
    },
    frequency: {
      type: 'text',
    },
    created_at: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    completed_at: {
      type: 'timestamptz',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('goals');
}
