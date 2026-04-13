import { pool } from '../src/config/db.js';

export async function seedMeasurementTypes() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(
      `
      INSERT INTO measurement_types (name, label, unit, category, version, is_system, is_active)
      VALUES
        ('weight', 'Weight', 'kg', 'body', 1, true, true),
        ('neck', 'Neck', 'cm', 'body', 1, true, true),
        ('chest', 'Chest', 'cm', 'body', 1, true, true),
        ('waist', 'Waist', 'cm', 'body', 1, true, true),
        ('abdominal', 'Abdominal', 'cm', 'body', 1, true, true),
        ('hips', 'Hips', 'cm', 'body', 1, true, true),
        ('left_thigh', 'Left Thigh', 'cm', 'body', 1, true, true),
        ('right_thigh', 'Right Thigh', 'cm', 'body', 1, true, true),
        ('left_calf', 'Left Calf', 'cm', 'body', 1, true, true),
        ('right_calf', 'Right Calf', 'cm', 'body', 1, true, true),
        ('left_ankle', 'Left Ankle', 'cm', 'body', 1, true, true),
        ('right_ankle', 'Right Ankle', 'cm', 'body', 1, true, true),
        ('left_biceps', 'Left Biceps', 'cm', 'body', 1, true, true),
        ('right_biceps', 'Right Biceps', 'cm', 'body', 1, true, true),
        ('left_forearm', 'Left Forearm', 'cm', 'body', 1, true, true),
        ('right_forearm', 'Right Forearm', 'cm', 'body', 1, true, true),
        ('left_wrist', 'Left Wrist', 'cm', 'body', 1, true, true),
        ('right_wrist', 'Right Wrist', 'cm', 'body', 1, true, true),
        ('blood_pressure_systolic', 'Systolic BP', 'mmHg', 'health', 1, true, true),
        ('blood_pressure_diastolic', 'Diastolic BP', 'mmHg', 'health', 1, true, true),
        ('pulse', 'Pulse', 'bpm', 'health', 1, true, true)
      ON CONFLICT (name)
      DO UPDATE
      SET
        label = EXCLUDED.label,
        unit = EXCLUDED.unit,
        category = EXCLUDED.category,
        version = EXCLUDED.version
      WHERE measurement_types.version < EXCLUDED.version;
      `
    );

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
