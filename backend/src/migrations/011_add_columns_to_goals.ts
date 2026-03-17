import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.addColumn('goals', {
    goal_type: {
      type: 'text',
      notNull: true,
    },
    start_value: {
      type: 'numeric',
    },
    unit: {
      type: 'text',
    },
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropColumn('goals', ['goal_type', 'start_value', 'text']);
}
