import React, { useState } from 'react';

import './style.css';
import { createGoal, type Goal } from '../../api/goals.api';

type FrequencyType = 'daily' | 'weekly' | 'monthly';
type TargetType = 'count' | 'date';
type GoalType = 'counter' | 'metric';

type GoalFormProps = {
  onCreate: (goal: Goal) => void;
};

export function GoalForm({ onCreate }: GoalFormProps) {
  const [title, setTitle] = useState('');
  const [frequency, setFrequency] = useState<FrequencyType>('daily');
  const [targetType, setTargetType] = useState<TargetType>('count');
  const [startValue, setStartValue] = useState<number>(0);
  const [targetValue, setTargetValue] = useState<number>(0);
  const [tasksCount, setTasksCount] = useState<number>(0);
  const [startDate, setStartDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [untilDate, setUntilDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [goalType, setGoalType] = useState<GoalType>('counter');
  const [unit, setUnit] = useState('kg');

  console.log(untilDate);
  console.log(tasksCount);

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
    // if (event.target.value === 'count') {
    //   setTargetValue(() => 2);
    // } else {
    //   setTargetValue(() => new Date().toLocaleDateString('en-CA'));
    // }
  }

  // function handleChangeTargetValue(event: React.ChangeEvent<HTMLInputElement>) {
  //   if (event.target) setTargetValue(event.target.value);

  //   if (targetType === 'count') {
  //     if (event.target) setTasksCount(+event.target.value);
  //   } else {
  //     setTasksCount(calcTargetValues(event.target.value, frequency));
  //   }
  // }

  function handleTargetValue(event: React.ChangeEvent<HTMLInputElement>) {
    setTargetValue(+event.target.value);
  }

  function handleCountTasks(event: React.ChangeEvent<HTMLInputElement>) {
    setTasksCount(+event.target.value);
    setTargetValue(+event.target.value);
  }

  function handleCountTasksUntilDate(event: React.ChangeEvent<HTMLInputElement>) {
    setTasksCount(calcTargetValues(event.target.value, frequency));
    setUntilDate(event.target.value);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const dto: Goal = {
      title,
      goal_type: goalType,
      start_date: startDate,
      until_date: untilDate,
      start_value: startValue,
      target_value: targetValue,
      target_type: targetType,
      frequency: frequency,
      tasks_count: tasksCount,
    };

    const response = await createGoal(dto);
    onCreate(response as Goal);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Goal</h2>

      <label>
        Choose a Goal type:
        <select value={goalType} onChange={(e) => setGoalType(e.target.value as GoalType)}>
          <option value="counter">counter</option>
          <option value="metric">metric</option>
        </select>
      </label>

      <input
        className="form-title-input"
        type="text"
        placeholder="Learn 30 words a day"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div className="form-input-block">
        <label>
          Start date:
          <input type="date" value={startDate} onChange={handleChangeStartDate} />
        </label>

        <select value={frequency} onChange={(e) => setFrequency(e.target.value as FrequencyType)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {goalType === 'counter' && (
          <>
            <select value={targetType} onChange={handleChangeTargetType}>
              <option value="count">Number of tasks</option>
              <option value="date">Until date</option>
            </select>

            {/* <input
              type={targetType === 'count' ? 'number' : 'date'}
              value={targetValue}
              onChange={handleChangeTargetValue}
              min={1}
            /> */}

            {targetType === 'count' && (
              <input type="number" value={targetValue} onChange={handleCountTasks} min={0} />
            )}

            {targetType === 'date' && (
              <input type="date" value={untilDate} onChange={handleCountTasksUntilDate} />
            )}
          </>
        )}

        {goalType === 'metric' && (
          <>
            <label>
              Unit:
              <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="kg">kg</option>
                <option value="cm">cm</option>
              </select>
            </label>

            <label>
              Start value:
              <input
                type="number"
                value={startValue}
                onChange={(e) => setStartValue(+e.target.value)}
                placeholder="Start value"
              />
            </label>

            <label>
              Target value:
              <input
                type="number"
                value={targetValue}
                onChange={handleTargetValue}
                placeholder="Target value"
              />
            </label>
            <label>
              Until date:
              <input type="date" value={untilDate} onChange={handleCountTasksUntilDate} />
            </label>
          </>
        )}
      </div>

      <button type="submit">Create New Goal</button>
    </form>
  );
}
