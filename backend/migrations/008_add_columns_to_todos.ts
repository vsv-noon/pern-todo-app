import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('todos', {
    goal_id: {
      type: 'integer',
      references: 'goals(id)',
      onDelete: 'CASCADE',
    },
    is_generated: {
      type: 'boolean',
      default: false,
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('todos', ['goal_id', 'is_generated']);
}
