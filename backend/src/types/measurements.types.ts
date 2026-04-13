export type MeasurementsRow = {
  type_id: number;
  goal_id: number;
  measured_value: number;
  note: string;
  measured_at: Date;
};

export interface MeasurementInput {
  type: string;
  measured_value: number;
}

export interface SaveFullBodyMeasurementsDTO {
  userId: number;
  measuredAt?: Date;
  measurements: MeasurementInput[];
  comment: string;
}

export interface MeasurementRow {
  userId: number;
  typeId: number;
  sessionId: number;
  measuredValue: number;
  measuredAt: Date;
}

export interface Session {
  id: number;
}

export interface SaveMeasurementsResult {
  message: string;
  sessionId: number;
}
