import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('goals', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
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
    type_id: {
      type: 'integer',
      references: 'measurement_types',
      onDelete: 'CASCADE',
    },
    goal_type: {
      type: 'text',
      notNull: true,
    },
    description: {
      type: 'text',
    },
    unit: {
      type: 'text',
    },
    start_value: {
      type: 'double precision',
    },
    current_value: {
      type: 'double precision',
      default: 0,
    },
    target_value: {
      type: 'double precision',
      notNull: true,
    },
    target_type: {
      type: 'text',
    },
    start_date: {
      type: 'date',
    },
    until_date: {
      type: 'date',
    },
    tasks_count: {
      type: 'integer',
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
