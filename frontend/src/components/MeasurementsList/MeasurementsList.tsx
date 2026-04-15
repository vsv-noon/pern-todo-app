import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';

function MeasurementsList({ id }: { id: number | null }) {
  const [value, setValue] = useState();

  useEffect(() => {
    try {
      if (!id) return;
      async function load() {
        const data = await apiFetch(`/measurement-sessions/${id}`);
        setValue(data);
      }
      load();
    } catch (err) {
      console.error(err);
    }
  }, [id]);
  return (
    <>
      <div>
        MeasurementsList
        {value &&
          value.measurements.map((el, i) => (
            <div key={i}>
              {el.type} {el.label} {el.measured_value} {el.unit}
            </div>
          ))}
      </div>
    </>
  );
}

export default MeasurementsList;
