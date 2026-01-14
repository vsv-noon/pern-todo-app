export async function up(pgm) {
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
    `,
  );

  pgm.createTrigger('todos', 'set_updated_at_trigger', {
    when: 'BEFORE',
    operation: 'UPDATE',
    function: 'set_updated_at',
  });
}

export async function down(pgm) {
  pgm.dropTrigger('todos', 'set_updated_at_trigger');
  pgm.dropFunction('set_updated_at');
}
