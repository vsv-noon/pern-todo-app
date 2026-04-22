import { Link } from 'react-router-dom';
import type { CalendarEventProps } from '../../pages/MeasurementsPage/MeasurementsPage';
import { getSystemLocalFormat } from '../../utils/date';
import { apiDelete } from '../../services/api/api';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { useState } from 'react';

export interface MeasurementsListProps {
  sessionsList: CalendarEventProps[];
  setSessionsList: React.Dispatch<React.SetStateAction<CalendarEventProps[]>>;
}

function MeasurementsList({ sessionsList, setSessionsList }: MeasurementsListProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  function groupTypes(items: CalendarEventProps[]) {
    return {
      body: items.filter((t) => t.category === 'body'),
      health: items.filter((t) => t.category === 'health'),
    };
  }

  const grouped = groupTypes(sessionsList);

  function handleDeleteClick(itemId: number) {
    setItemToDelete(itemId);
    setModalOpen(true);
  }

  async function handleConfirmDelete(sessionId: number | null) {
    if (!sessionsList) return;
    setSessionsList((prev) => prev.filter((item) => item.id !== sessionId));
    try {
      await apiDelete(`/measurement-sessions/${sessionId}`);
      setItemToDelete(null);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div>
        <h3>Body measurements list</h3>
        <ul className="measurementsList">
          {sessionsList &&
            grouped.body.map((el, i) => (
              <li key={i}>
                <Link to={`measurements-details/${el.id}`} onClick={(e) => e.stopPropagation()}>
                  {getSystemLocalFormat(el.recorded_at).replace('T', ', ')}
                </Link>
                <button onClick={() => handleDeleteClick(el.id)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h3>Health metrics list</h3>
        <ul className="measurementsList">
          {sessionsList &&
            grouped.health.map((el, i) => (
              <li key={i}>
                <Link to={`measurements-details/${el.id}`} onClick={(e) => e.stopPropagation()}>
                  {getSystemLocalFormat(el.recorded_at).replace('T', ', ')}
                  {/* {el.recorded_at} */}
                </Link>
                <button onClick={() => handleDeleteClick(el.id)}>Delete</button>
              </li>
            ))}
        </ul>
      </div>
      <ConfirmationDialog
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Are your sure?"
        message={`Do you really want to delete session "${itemToDelete}"`}
        onConfirm={() => handleConfirmDelete(itemToDelete)}
      />
    </>
  );
}

export default MeasurementsList;
