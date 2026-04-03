import { useState } from 'react';
import { apiFetch } from '../../api/client';

interface MeasurementInputProps {
  goalId: number;
  onMeasurement: () => void;
}

export function MeasurementInput({ goalId, onMeasurement }: MeasurementInputProps) {
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date().toLocaleDateString('en-CA'));

  const addMeasurement = async () => {
    await apiFetch('/goal-measurements', {
      method: 'POST',
      body: JSON.stringify({
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
