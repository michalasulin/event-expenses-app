import React from 'react';

function EventList({ events, selectedEventId, onSelect }) {
  if (!events || events.length === 0) {
    return <p>אין עדיין אירועים.</p>;
  }

  return (
    <ul className="event-list">
      {events.map((event) => {
        const isSelected = event.id === selectedEventId;

        return (
          <li
            key={event.id}
            className={`event-list-item ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelect(event.id)}
          >
            <div className="event-list-item-main">
              <span className="event-name">{event.name}</span>
              <span className="event-date">{event.date}</span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default EventList;
