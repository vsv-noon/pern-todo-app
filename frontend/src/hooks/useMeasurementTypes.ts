import { useEffect, useState } from 'react';
import { apiFetch } from '../services/api/api';

export interface MeasurementType {
  id: number;
  name: string;
  label: string;
  unit: string;
  category: 'body' | 'health';
  is_system: boolean;
  is_active: boolean;
}

export function useMeasurementTypes() {
  const [types, setTypes] = useState<MeasurementType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      async function load() {
        const data: MeasurementType[] = await apiFetch('/measurement-types');
        setTypes(data.filter((t: MeasurementType) => t.is_active !== false));
      }
      load();
    } finally {
      setLoading(false);
    }
  }, []);

  return { types, loading };
}
