import { apiFetch } from '../../services/api/api';
import type { Task } from '../../pages/TasksPage/TasksPage';
import TaskItem from '../TaskItem/TaskItem';

function TasksList({
  tasks,
  setTasks,
}: {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}) {
  async function handleUpdate(item: Task, { status }: { status: string }) {
    setTasks((prev) => prev.map((t) => (t.id === item.id ? { ...t, status } : t)));

    try {
      await apiFetch(`/tasks/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: status }),
      });

      setTasks((prev) => prev.map((t) => (t.id === item.id ? { ...t, status: item.status } : t)));
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>TasksList</h2>

      <ul>{tasks && tasks.map((el) => <TaskItem task={el} onUpdate={handleUpdate} />)}</ul>
    </div>
  );
}

export default TasksList;
