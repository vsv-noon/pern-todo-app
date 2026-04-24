import { useState } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { Link } from 'react-router-dom';
import TasksList from '../../components/TasksList/TasksList';
import 'react-day-picker/style.css';

function TasksPage() {
  const [selected, setSelected] = useState<DateRange | undefined>();
  console.log(selected);

  const handleSelect = (newSelected) => {
    setSelected(newSelected);
  };
  return (
    <div>
      <h1>TasksPage</h1>

      <Link to="/task-form">Task Form</Link>
      <DayPicker mode="range" selected={selected} onSelect={handleSelect} />
      <TasksList />
    </div>
  );
}

export default TasksPage;
