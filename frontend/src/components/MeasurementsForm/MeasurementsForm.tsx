import React, { useState } from 'react';
import { apiFetch } from '../../services/api/api';
import { useMeasurementTypes, type MeasurementType } from '../../hooks/useMeasurementTypes';
import { useNavigate } from 'react-router-dom';
import { getSystemLocalFormat } from '../../utils/date';

function MeasurementsForm() {
  const { types, loading } = useMeasurementTypes();
  const [values, setValues] = useState<Record<string, string>>({});
  const [comment, setComment] = useState('');
  const [localTime, setLocalTime] = useState(getSystemLocalFormat(new Date()));
  const [category, setCategory] = useState('body');
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function groupTypes(types: MeasurementType[]) {
    return {
      body: types.filter((t) => t.category === 'body'),
      health: types.filter((t) => t.category === 'health'),
    };
  }

  const grouped = groupTypes(types);

  function handleChange(key: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  // function handleAddField() {
  //   const name = prompt('Enter new measurement name (e.g. neck');
  //   if (!name) return;

  //   const key = name.toLocaleLowerCase().replace(/\s+/g, '_');

  //   setFields((prev) => [...prev, { key, label: `${name} (cm)` }]);
  // }

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
      // setLoading(true);

      await apiFetch('/measurements/body', {
        method: 'POST',
        body: JSON.stringify({
          measured_at: new Date(localTime).toISOString(),
          measurements,
          category: category,
          comment,
        }),
      });

      alert('Measurements saved!');
      setValues({});
      setComment('');
      navigate('/measurements');
    } catch (err) {
      console.error(err);
      alert('Error saving measurements');
    } finally {
      // setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>New measurements</h2>
      <label>Category</label>
      <select onChange={(e) => setCategory(e.target.value)}>
        <option value="body">Body measurements (weight, circumference)</option>
        <option value="health">Health metrics (blood pressure, heart rate)</option>
      </select>

      {/* <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> */}
      {/* <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /> */}
      <input
        type="datetime-local"
        value={localTime}
        onChange={(e) => setLocalTime(e.target.value)}
      />
      {category === 'body' && (
        <>
          <h3>Body measurements (circumference)</h3>
          <div style={styles.grid}>
            {grouped.body.map((type) => (
              <div key={type.id} style={styles.field}>
                <label>
                  {type.label} ({type.unit})
                </label>
                <input
                  type="number"
                  step={type.name === 'weight' ? '0.1' : '1'}
                  value={values[type.name] || ''}
                  onChange={(e) => handleChange(type.name, e.target.value)}
                  placeholder={type.name === 'weight' ? '0.0' : '0'}
                />
              </div>
            ))}
          </div>
        </>
      )}

      {category === 'health' && (
        <>
          <h3>Health metrics</h3>

          <div style={styles.grid}>
            {grouped.health.map((type) => (
              <div key={type.id} style={styles.field}>
                <label>
                  {type.label} ({type.unit})
                </label>
                <input
                  type="number"
                  step="1"
                  value={values[type.name] || ''}
                  onChange={(e) => handleChange(type.name, e.target.value)}
                  placeholder="0"
                  required
                />
              </div>
            ))}
          </div>
        </>
      )}

      {/* <button type="button" onClick={handleAddField}>
        {' '}
        + Add measurement
      </button> */}

      {/* <textarea
        placeholder="Comment (optional"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      /> */}

      <button type="submit">{loading ? 'Saving...' : 'Save Measurements'}</button>
    </form>
  );
}

export default MeasurementsForm;

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
  field: {
    display: 'flex',
    flexDirection: 'column',
  },
  textarea: {
    minHeight: 80,
  },
};
