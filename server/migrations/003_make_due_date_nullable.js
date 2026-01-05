export async function up(pgm) {
  pgm.alterColumn("todos", "due_date", {
    notNull: false,
  });
}

export async function down(pgm) {
  pgm.alterColumn("todos", "due_date", {
    notNull: true,
  });
}
