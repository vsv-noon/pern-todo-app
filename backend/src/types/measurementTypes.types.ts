export interface MeasurementType {
  id: number;
  name: string;
  label: string;
  unit: string;
  category?: string;
  created_at: Date;
}

export interface CreateMeasurementTypeDTO {
  name: string;
  label: string;
  unit: string;
  category?: string;
}

export interface UpdateMeasurementTypeDTO {
  id: number;
  name?: string;
  label?: string;
  unit: string;
  category?: string;
}
