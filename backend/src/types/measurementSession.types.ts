export interface SessionMeasurement {
  type: string;
  label: string;
  unit: string;
  value: number;
}

export interface MeasurementSessionDTO {
  id: number;
  user_id: number;
  session_date: string;
  category: string;
  measurements: SessionMeasurement[];
}

export interface UpdateSessionDTO {
  sessionId: number;
  measurements: {
    name: string;
    value: number;
  }[];
  replaceAll?: boolean;
}
