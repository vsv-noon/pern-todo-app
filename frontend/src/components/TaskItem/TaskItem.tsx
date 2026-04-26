import type { Task } from '../../pages/TasksPage/TasksPage';

import './style.css';

function TaskItem({
  task,
  onUpdate,
}: {
  task: Task;
  onUpdate: (task: Task, { status }: { status: string }) => void;
}) {
  return (
    <li key={task.id} className="task-item">
      <h5 title="task name">
        {task.title} {task.id}{' '}
        {task.status === 'missed' && <span style={{ color: 'red' }}>missed</span>}
      </h5>
      <select
        value={task.status}
        onChange={(e) => onUpdate(task, { status: e.target.value })}
        // style={task.status === 'missed' ? { color: 'red' } : { color: 'black' }}
        title="status"
      >
        <option value="pending">pending</option>
        <option value="done">done</option>
        <option value="skipped">skipped</option>
        {/* <option value="missed" disabled> */}
        <option value="missed" style={{ color: 'red' }} disabled>
          missed
        </option>
      </select>
      <span title="Due Date">{task.due_date}</span>
    </li>
  );
}

export default TaskItem;
