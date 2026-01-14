export async function up(pgm) {
  pgm.addColumn('todos', {
    deleted_at: {
      type: 'timestamptz',
      notNull: false,
    },
  });

  pgm.createIndex('todos', 'deleted_at');
}

export async function down(pgm) {
  pgm.dropColumn('todos', 'deleted_at');
}
