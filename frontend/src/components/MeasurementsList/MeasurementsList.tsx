import { Link } from 'react-router-dom';
import type { CalendarEventProps } from '../../pages/MeasurementsPage/MeasurementsPage';

function MeasurementsList({ sessions }: { sessions: CalendarEventProps[] }) {
  return (
    <>
      <div>
        <h2>Measurements list</h2>
        <ul className="measurementsList">
          {sessions &&
            sessions.map((el, i) => (
              <li key={i}>
                <Link to={`measurements-details/${el.id}`} onClick={(e) => e.stopPropagation()}>
                  {new Date(el.recorded_at).toLocaleString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                  })}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}

export default MeasurementsList;
