import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(
    `
    CREATE TABLE task_recurrence (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    
    task_id INTEGER UNIQUE REFERENCES todos(id) ON DELETE CASCADE,

    type TEXT CHECK (type IN ('daily', 'weekly', 'monthly')),
    interval INTEGER DEFAULT 1,

    days_of_week INTEGER[],
    day_of_month INTEGER,

    start_date DATE NOT NULL,
    end_date DATE
    );
    `
  );
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE task_recurrence;
    `);
}
