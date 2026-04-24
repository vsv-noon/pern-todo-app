import { MigrationBuilder } from 'node-pg-migrate';

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createFunction(
    'set_updated_at',
    [],
    {
      returns: 'trigger',
      language: 'plpgsql',
    },
    `
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    `
  );

  pgm.createTrigger('tasks', 'set_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'set_updated_at',
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTrigger('tasks', 'set_updated_at_trigger');
  pgm.dropFunction('set_updated_at', []);
}
