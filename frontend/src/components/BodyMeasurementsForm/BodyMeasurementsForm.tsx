import React, { useState } from 'react';
import { apiFetch } from '../../services/api/api';

type MeasurementField = {
  key: string;
  label: string;
};

type MeasurementsState = Record<string, string>;

const defaultFields: MeasurementField[] = [
  { key: 'waist', label: 'Waist (cm)' },
  { key: 'chest', label: 'Chest (cm)' },
  { key: 'hips', label: 'Hips (cm)' },
  { key: 'left_biceps', label: 'Left Biceps (cm)' },
  { key: 'right_biceps', label: 'Right Biceps (cm)' },
  { key: 'thigh', label: 'Thigh (cm)' },
];

export function BodyMeasurementsForm() {
  const [fields, setFields] = useState<MeasurementField[]>(defaultFields);
  const [values, setValues] = useState<MeasurementsState>({});
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function handleAddField() {
    const name = prompt('Enter new measurement name (e.g. neck');
    if (!name) return;

    const key = name.toLocaleLowerCase().replace(/\s+/g, '_');

    setFields((prev) => [...prev, { key, label: `${name} (cm)` }]);
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const measurements = Object.entries(values)
      .filter(([_, value]) => value !== '')
      .map(([type, measured_value]) => ({ type, measured_value: Number(measured_value) }));

    if (measurements.length === 0) {
      alert('Please enter at least one measurement');
      return;
    }

    try {
      setLoading(true);

      await apiFetch('/measurements/body', {
        method: 'POST',
        body: JSON.stringify({
          measured_at: new Date().toLocaleDateString('en-CA'),
          measurements,
          comment,
        }),
      });

      // const res = await fetch('http://localhost:5000/api/measurements/body', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   credentials: 'include',
      //   body: JSON.stringify({
      //     measuredAt: new Date().toISOString(),
      //     measurements,
      //     comment,
      //   }),
      // });

      // if (!res.ok) {
      //   throw new Error('Failed to save');
      // }

      alert('Measurements saved!');
      setValues({});
      setComment('');
    } catch (err) {
      console.error(err);
      alert('Error saving measurements');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Body Measurements</h2>

      <div style={styles.grid}>
        {fields.map((field) => (
          <div key={field.key} style={styles.field}>
            <label>{field.label}</label>
            <input
              type="number"
              step="0.1"
              value={values[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder="0.0"
            />
          </div>
        ))}
      </div>

      <button type="button" onClick={handleAddField}>
        {' '}
        + Add measurement
      </button>

      <textarea
        placeholder="Comment (optional"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <button type="submit">{loading ? 'Saving...' : 'Save Measurements'}</button>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    maxWidth: 500,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
  },
  fields: {
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    minHeight: 80,
  },
};
