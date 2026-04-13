import { useState } from 'react';
import { apiFetch } from '../../services/api/api';
import { useMeasurementTypes } from '../../hooks/useMeasurementTypes';

interface MeasurementInputProps {
  goalId: number;
  onMeasurement: () => void;
}

export function MeasurementInput({ goalId, onMeasurement }: MeasurementInputProps) {
  // const [value, setValue] = useState('');
  const { types } = useMeasurementTypes();
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));
  // console.log(types.filter((e) => e.name === 'weight'));
  console.log(types[0].id);
  const addMeasurement = async () => {
    await apiFetch('/measurements', {
      method: 'POST',
      body: JSON.stringify({
        type_id: types[0].id,
        goal_id: goalId,
        measured_value: Number(value),
        measured_at: date,
      }),
    });
    onMeasurement();
    setValue('');
    // onMeasurementAdded(); // refresh goal
  };

  return (
    <div>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input
        type="number"
        step="0.1"
        placeholder="Enter measurement"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={addMeasurement}>Measure</button>
    </div>
  );
}
