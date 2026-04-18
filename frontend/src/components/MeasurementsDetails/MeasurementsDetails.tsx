import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';
import { useOutletContext, useParams } from 'react-router-dom';

import './style.css';

export interface MeasurementsProps {
  label: string;
  measured_value: number;
  unit: string;
}

export interface MeasurementDetailsProps {
  session_date: string;
  recorded_at: string;
  measurements: MeasurementsProps[];
}

function MeasurementDetails() {
  const { handleCloseDetails } = useOutletContext<{ handleCloseDetails: () => void }>();
  const [value, setValue] = useState<MeasurementDetailsProps>();

  const { id } = useParams();
  useEffect(() => {
    try {
      if (!id) return;
      async function load() {
        const data = await apiFetch(`/measurement-sessions/${id}`);
        setValue(data as MeasurementDetailsProps);
      }
      load();
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  return (
    <div className="measurementsDetails">
      <button onClick={handleCloseDetails}>Close</button>
      <h2>Measurements details</h2>
      <h4>{value && value.session_date}</h4>
      <h5>{value && new Date(value.recorded_at).toLocaleString()}</h5>
      <ul className="measurementsDetailsList">
        {value &&
          value.measurements.map((el, i) => (
            <li key={i}>
              <span>{el.label}</span>
              <span>
                {el.measured_value} {el.unit}
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default MeasurementDetails;
