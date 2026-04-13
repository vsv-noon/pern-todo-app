import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE OR REPLACE FUNCTION update_goal_counter()
    RETURNS TRIGGER AS $$
    DECLARE
      goal_type text;
    BEGIN
      SELECT g.goal_type INTO goal_type
      FROM goals g
      WHERE g.id = COALESCE(NEW.goal_id, OLD.goal_id);

      IF goal_type IS NULL OR goal_type != 'counter' THEN
        RETURN COALESCE(NEW, OLD);
      END IF;

      IF (TG_OP = 'INSERT' AND NEW.completed = true) THEN
        UPDATE goals SET current_value = current_value + 1 WHERE id = NEW.goal_id;
      ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.completed = false AND NEW.completed = true) THEN
            UPDATE goals SET current_value = current_value + 1 WHERE id = NEW.goal_id;
        ELSIF (OLD.completed = true AND NEW.completed = false) THEN
            UPDATE goals SET current_value = current_value - 1 WHERE id = NEW.goal_id;
        END IF;      
      ELSIF (TG_OP = 'DELETE' AND OLD.completed = true) THEN
        UPDATE goals SET current_value = current_value - 1 WHERE id = OLD.goal_id;
      END IF;

      RETURN COALESCE(NEW, OLD);
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER trg_update_goal_on_todo_change
    AFTER INSERT OR UPDATE OR DELETE ON todos
    FOR EACH ROW  
    EXECUTE FUNCTION update_goal_counter();
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`DROP TRIGGER IF EXISTS trg_update_goal_on_todo_change ON todos;`);
  pgm.sql(`DROP FUNCTION IF EXISTS update_goal_counter();`);
}
