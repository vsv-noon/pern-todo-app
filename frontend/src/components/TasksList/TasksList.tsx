import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';

function TasksList() {
  const [tasksList, setTasksList] = useState();

  useEffect(() => {
    async function loadTasksList() {
      try {
        const data = await apiFetch(`/tasks/range?start=${'2026-04-01'}&end=${'2026-04-30'}`);
        // const data = await apiFetch(`/tasks/range?start=2026-04-23&end=2026-04-30`)
        // console.log(data);

        setTasksList(data);
      } catch (err) {
        console.error(err);
      }
    }

    loadTasksList();
  }, []);

  return (
    <div>
      <h2>TasksList</h2>

      <ul>
        {tasksList?.map((el, i) => (
          <li key={i}>
            {el.id} {el.title} {el.due_date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TasksList;
