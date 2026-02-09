type GoalProps = {
  title: string;
  frequency: string;
  target_value: number;
  target_type: number;
  period: string;
};

export function generateTasks(goal: GoalProps) {
  const tasks = [];
  const startDate = new Date();

  let currentDate = new Date(startDate);
  let count = 0;

  while (count < goal.target_value) {
    const taskTitle = `${goal.title} (${frequencyLabel(goal.frequency)})`;

    tasks.push({
      title: taskTitle,
      due_date: currentDate,
    });

    currentDate = nextDate(currentDate, goal.frequency);
    count++;
  }

  console.log(currentDate);

  console.log(tasks);
  return tasks;
}

function nextDate(date: Date, frequency: string): Date {
  const next = new Date(date);
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      break;
  }
  return next;
}

function frequencyLabel(freq: string): string {
  return { daily: 'daily', weekly: 'weekly', monthly: 'monthly' }[freq] || '';
}
