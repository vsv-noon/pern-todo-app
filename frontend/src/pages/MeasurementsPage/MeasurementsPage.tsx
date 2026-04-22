import { useEffect, useState } from 'react';
import { apiFetch } from '../../services/api/api';

import Calendar from 'react-calendar';
// import type { CalendarProps } from 'react-calendar/src/Calendar.js';
import 'react-calendar/dist/Calendar.css';
import MeasurementsList from '../../components/MeasurementsList/MeasurementsList';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

import './style.css';
import MeasurementsChart from '../../components/MeasurementsChart/MeasurementsChart';

export interface CalendarEventProps {
  id: number;
  user_id: number;
  session_date: string;
  recorded_at: Date;
  category: string;
  created_at: Date;
}

function MeasurementsPage() {
  const [sessionsList, setSessionsList] = useState<CalendarEventProps[]>([]);
  // const [sessionId, setSessionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCloseDetails = () => {
    navigate(`/measurements`);
  };
  function handleClickDay(clickedDay: Date, event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const foundSession = sessionsList.find(
      (s) => s.session_date === clickedDay.toLocaleDateString('en-CA'),
    );

    if (foundSession) {
      // setSessionId(foundSession.id);
      navigate(`/measurements/measurements-details/${foundSession.id}`);
    }
  }

  useEffect(() => {
    try {
      setLoading(true);
      async function loadSessions() {
        const data = await apiFetch('/measurement-sessions');
        setSessionsList(data as CalendarEventProps[]);
      }

      loadSessions();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="measurementsPage" onClick={handleCloseDetails}>
      {loading && <Loader />}
      <Link className="link-btn" to="/measurement-form" onClick={(e) => e.stopPropagation()}>
        New Measurement
      </Link>
      {sessionsList && (
        <>
          <div className="measurementChartBlock">
            <Calendar
              onClickDay={handleClickDay}
              tileClassName={({ date, view }: { date: Date; view: string }) => {
                if (view === 'month') {
                  const formattedDate = date.toLocaleDateString('en-CA');
                  const hasEvent = sessionsList.find(
                    (event) => event.session_date === formattedDate,
                  );
                  return hasEvent ? 'highlight' : null;
                }
              }}
            />
            <MeasurementsChart sessionsList={sessionsList} />
          </div>
          <MeasurementsList sessionsList={sessionsList} setSessionsList={setSessionsList} />
          <div onClick={(e) => e.stopPropagation()}>
            <Outlet context={{ handleCloseDetails }} />
          </div>
        </>
      )}
    </div>
  );
}

export default MeasurementsPage;
