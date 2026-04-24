import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE task_instances (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    task_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    due_date DATE NOT NULL,
    status TEXT DEFAULT 'pending'
      CHECK (status IN ('pending', 'done', 'skipped')),

    value NUMERIC,

    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(task_id, due_date)
    );
    `);

  pgm.sql(`
    CREATE INDEX idx_instances_user_date
    ON task_instances(user_id, due_date);
    `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE task_instances;
    `);
}
