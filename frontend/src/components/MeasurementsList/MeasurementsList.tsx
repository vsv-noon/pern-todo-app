import { Link } from 'react-router-dom';
import type { CalendarEventProps } from '../../pages/MeasurementsPage/MeasurementsPage';
import { getSystemLocalFormat } from '../../utils/date';

function MeasurementsList({ sessions }: { sessions: CalendarEventProps[] }) {
  function groupTypes(items: CalendarEventProps[]) {
    return {
      body: items.filter((t) => t.category === 'body'),
      health: items.filter((t) => t.category === 'health'),
    };
  }

  const grouped = groupTypes(sessions);

  return (
    <>
      <div>
        <h3>Body measurements list</h3>
        <ul className="measurementsList">
          {sessions &&
            grouped.body.map((el, i) => (
              <li key={i}>
                <Link to={`measurements-details/${el.id}`} onClick={(e) => e.stopPropagation()}>
                  {getSystemLocalFormat(el.recorded_at).replace('T', ', ')}
                </Link>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h3>Health metrics list</h3>
        <ul className="measurementsList">
          {sessions &&
            grouped.health.map((el, i) => (
              <li key={i}>
                <Link to={`measurements-details/${el.id}`} onClick={(e) => e.stopPropagation()}>
                  {getSystemLocalFormat(el.recorded_at).replace('T', ', ')}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default MeasurementsList;
