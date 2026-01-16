import { useEffect, useState } from 'react';
import type { Todo } from '../../types/todo';
import { fetchDeletedTodos, hardDeleteTodo, restoreTodo } from '../../api/api';
import './TrashList.css';

export function TrashList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleRestore(id: number) {
    await restoreTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  }

  async function handleHardDelete(id: number) {
    if (!confirm('Delete permanently? This cannot be undone.')) return;

    await hardDeleteTodo(id);
    setTodos((t) => t.filter((x) => x.id !== id));
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await fetchDeletedTodos();
      setTodos(data);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>🗑 Deleted tasks</h2>

      {todos.length === 0 && <p>No deleted tasks</p>}

      <ul>
        {todos.map((t) => (
          <li key={t.id} className="trashItem">
            <span className="title">{t.title}</span>
            <span>{t.due_date}</span>
            <div className='actions'>
              <button onClick={() => handleRestore(t.id)}>♻ Restore</button>
              <button onClick={() => handleHardDelete(t.id)}>❌ Delete forever</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
