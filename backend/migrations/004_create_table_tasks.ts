import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable('tasks', {
    id: {
      type: 'integer GENERATED ALWAYS AS IDENTITY',
      primaryKey: true,
    },

    user_id: {
      type: 'integer',
      references: 'users',
      onDelete: 'CASCADE',
    },

    goal_id: {
      type: 'integer',
      references: 'goals',
      onDelete: 'CASCADE',
    },

    title: {
      type: 'varchar(255)',
      notNull: true,
    },

    description: {
      type: 'text',
    },

    completed: {
      type: 'boolean',
      notNull: true,
      default: false,
    },

    priority: {
      type: 'text',
      default: 'medium',
    },

    position: {
      type: 'integer',
      default: 0,
    },

    completed_at: {
      type: 'timestamptz',
      notNull: false,
    },

    deleted_at: {
      type: 'timestamptz',
      notNull: false,
    },

    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },

    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()'),
    },

    is_recurring: {
      type: 'boolean',
      default: false,
    },

    is_active: {
      type: 'boolean',
      default: true,
    },
  });

  pgm.createIndex('tasks', 'deleted_at');
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable('tasks');
}
