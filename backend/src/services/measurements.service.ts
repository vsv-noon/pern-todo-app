import * as measurementsModel from '../models/measurements.model.js';
import * as measurementTypesModel from '../models/measurementTypes.model.js';
import * as measurementSessionsModel from '../models/measurementSessions.model.js';
import { pool } from '../config/db.js';
import {
  MeasurementRow,
  SaveFullBodyMeasurementsDTO,
  SaveMeasurementsResult,
} from '../types/measurements.types.js';

export async function createNewMeasurement(
  userId: number,
  data: {
    type_id: number;
    session_id: number;
    goal_id: number;
    measured_value: number;
    note: string;
    measured_at: Date;
  }
) {
  return measurementsModel.createGoalMeasurement(userId, data);
}

export async function saveFullBodyMeasurements(
  userId: number,
  dto: SaveFullBodyMeasurementsDTO
): Promise<SaveMeasurementsResult> {
  const client = await pool.connect();

  console.log(dto);

  const date = dto.measured_at || new Date();

  try {
    await client.query('BEGIN');

    const session = await measurementSessionsModel.createSession(client, {
      userId,
      sessionDate: date,
      category: dto.category,
    });

    const sessionId = session.id;

    const typeNames = [...new Set(dto.measurements.map((m) => m.type))];

    await measurementTypesModel.upsertMeasurementTypes(client, typeNames);

    const typeMap = await measurementTypesModel.getMeasurementTypesMap(client, typeNames);

    const rows: MeasurementRow[] = dto.measurements.map((m) => {
      if (typeof m.measured_value !== 'number' || m.measured_value <= 0) {
        throw new Error(`Invalid value for ${m.type}`);
      }

      const typeId = typeMap[m.type];

      if (!typeId) {
        throw new Error(`Type not found: ${m.type}`);
      }

      return {
        userId,
        typeId,
        sessionId,
        measuredValue: m.measured_value,
        measuredAt: date,
      };
    });

    await measurementsModel.insertMeasurements(client, rows);

    await client.query('COMMIT');

    return {
      message: 'Measurements saved',
      sessionId,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
