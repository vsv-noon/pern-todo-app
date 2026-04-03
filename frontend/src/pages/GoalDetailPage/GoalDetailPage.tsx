import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGoalById, type Goal } from '../../api/goals.api';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function GoalDetailPage() {
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal>();
  // console.log(goal);

  useEffect(() => {
    if (id) {
      async function fetchGoal(goalId: number) {
        const data = await fetchGoalById(goalId);
        setGoal(data);
      }
      fetchGoal(+id);
    }
  }, [id]);

  return (
    <div>
      {goal?.goal_type === 'metric' && (
        <div>
          <div>
            <h4>
              Progress to {goal.target_value} {goal.unit || ''}
            </h4>
            <span>Last: {goal.progress_data.measurements[0]?.measured_value || 0}</span>
          </div>

          <ResponsiveContainer width="90%" height={250}>
            <LineChart data={goal.progress_data.measurements}>
              <XAxis
                dataKey="measured_at"
                tickFormatter={(d) => new Date(d).toLocaleDateString('en-CA')}
              />
              <YAxis />
              <Tooltip labelFormatter={(d) => new Date(d).toLocaleDateString('en-CA')} />
              <Line
                type="monotone"
                dataKey="measured_value"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b9881', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey={() => goal.target_value}
                stroke="#6b7280"
                strokeDasharray="5 5"
                name="Goal"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default GoalDetailPage;
