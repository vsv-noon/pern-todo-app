export async function up(pgm) {
  pgm.addColumn('todos', {
    description: { type: 'text' },
  });
}

export async function down(pgm) {
  pgm.dropColumn('todos', 'description');
}
