// import { CSS } from '@dnd-kit/utilities';
// import { useSortable } from '@dnd-kit/sortable';
import type { Todo } from '../../types/todo';

type SortableTodoItemProps = {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onUpdate: () => void;
  onDelete: (todo: Todo) => void;
};

export function SortableTodoItem({ todo, onEdit, onUpdate, onDelete }: SortableTodoItemProps) {
  return (
    <li key={todo.id} className="todoItem">
      <input
        type="checkbox"
        title="select to complete"
        checked={todo.completed}
        onChange={onUpdate}
      />

      <span
        className="title"
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
        }}
      >
        {todo.title}
      </span>
      <span>{todo.description}</span>

      <div className="actions">
        <button onClick={() => onEdit(todo)}>✏️</button>

        <button onClick={() => onDelete(todo)}>🗑</button>
      </div>
      <span>{todo.due_date}</span>
    </li>
  );
}
