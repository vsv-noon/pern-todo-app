import { useState } from 'react';

import './style.css';
import { createGoal, type Goal } from '../../api/goals.api';

type FrequencyType = 'daily' | 'weekly' | 'monthly';
type TargetType = 'count' | 'date';

type GoalFormProps = {
  onCreate: (goal: Goal) => void;
};

export function GoalForm({ onCreate }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [targetType, setTargetType] = useState<TargetType>('count');
  const [targetValue, setTargetValue] = useState<number | string>(1);
  const [targetCount, setTargetCount] = useState<number>(0);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));

  function increment(date: Date, frequency: FrequencyType) {
    if (frequency === 'daily') date.setDate(date.getDate() + 1);
    if (frequency === 'weekly') date.setDate(date.getDate() + 7);
    if (frequency === 'monthly') date.setMonth(date.getMonth() + 1);
  }

  function calcTargetValues(date: string, freq: FrequencyType) {
    const currentDate = new Date(startDate);
    const targetDate = new Date(date);
    let count = 0;

    while (currentDate <= targetDate) {
      increment(currentDate, freq);
      count++;
    }

    return count;
  }

  function handleChangeStartDate(event: React.ChangeEvent<HTMLInputElement>) {
    setStartDate(event.target.value);
  }

  function handleChangeTargetType(event: React.ChangeEvent<HTMLSelectElement>) {
    setTargetType(event.target.value as TargetType);
    if (event.target.value === 'count') {
      setTargetValue(() => 2);
    } else {
      setTargetValue(() => new Date().toLocaleDateString('en-CA'));
    }
  }

  function handleChangeTargetValue(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target) setTargetValue(event.target.value);

    if (targetType === 'count') {
      if (event.target) setTargetCount(+event.target.value);
    } else {
      setTargetCount(calcTargetValues(event.target.value, frequency));
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const dto: Goal = {
      title,
      start_date: startDate,
      target_value: targetCount,
      target_type: targetType,
      frequency: frequency,
    };

    const response = await createGoal(dto);
    onCreate(response as Goal);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Goal</h2>

      <input
        className="form-title-input"
        type="text"
        placeholder="Learn 30 words a day"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <label>
        Start date:
        <input type="date" value={startDate} onChange={handleChangeStartDate} />
      </label>

      <div className="form-input-block">
        <select value={frequency} onChange={(e) => setFrequency(e.target.value as FrequencyType)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <select value={targetType} onChange={handleChangeTargetType}>
          <option value="count">Number of tasks</option>
          <option value="date">Until date</option>
        </select>

        <input
          type={targetType === 'count' ? 'number' : 'date'}
          value={targetValue}
          onChange={handleChangeTargetValue}
          min={1}
        />
      </div>

      <button type="submit">Create New Goal</button>
    </form>
  );
}
