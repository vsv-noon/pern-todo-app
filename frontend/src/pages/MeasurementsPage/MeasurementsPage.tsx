import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';

import Calendar from 'react-calendar';
// import type { CalendarProps } from 'react-calendar/src/Calendar.js';
import 'react-calendar/dist/Calendar.css';
import MeasurementsList from '../../components/MeasurementsList/MeasurementsList';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

import './style.css';

export interface CalendarEventProps {
  user_id: number;
  session_date: string;
  category: string;
  created_at: Date;
}

function MeasurementsPage() {
  const [sessions, setSessions] = useState<CalendarEventProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      async function load() {
        const data = await apiFetch('/measurement-sessions');
        setSessions(data as CalendarEventProps[]);
      }

      load();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
  return (
    <div className="measurementPage">
      {loading && <Loader />}
      <Link className="link-btn" to="/body-measurement-form">
        New Measurement
      </Link>
      {sessions && (
        <Calendar
          tileClassName={({ date, view }: { date: Date; view: string }) => {
            if (view === 'month') {
              const formattedDate = date.toLocaleDateString('en-CA');
              const hasEvent = sessions.find((event) => event.session_date === formattedDate);
              return hasEvent ? 'highlight' : null;
            }
          }}
        />
      )}
      <MeasurementsList />
    </div>
  );
}

export default MeasurementsPage;
