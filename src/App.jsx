import React, { useState, useEffect } from "react";
import EventList from "./components/EventList/EventList.jsx";
import EventDetails from "./components/EventDetails/EventDetails.jsx";
import "./styles/global.css";

// כתובת ה־API של השרת
const API_BASE_URL = "http://localhost:3001";

// מיישר את האובייקט שמגיע ממונגו לצורה שהפרונט מצפה אליה
const normalizeEvent = (event) => ({
  ...event,
  id: event.id || event._id,
  expenses: (event.expenses || []).map((exp) => ({
    ...exp,
    id: exp.id || exp._id,
  })),
});

function App() {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newEventForm, setNewEventForm] = useState({
    name: "",
    date: "",
    notes: "",
  });

  // ------------ טעינת אירועים מהשרת (פעם אחת) ------------
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) {
          throw new Error("Failed to load events from server");
        }

        const data = await res.json();
        const normalized = data.map(normalizeEvent);

        setEvents(normalized);

        if (!selectedEventId && normalized.length > 0) {
          setSelectedEventId(normalized[0].id);
        }
      } catch (err) {
        console.error(err);
        setError("שגיאה בטעינת האירועים מהשרת");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedEvent =
    events.find((event) => event.id === selectedEventId) || null;

  // ------------ הוספת אירוע חדש ------------
  const handleNewEventChange = (e) => {
    const { name, value } = e.target;
    setNewEventForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!newEventForm.name.trim()) {
      alert("שם אירוע הוא שדה חובה");
      return;
    }

    try {
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEventForm.name.trim(),
          date: newEventForm.date || "",
          notes: newEventForm.notes.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create event");
      }

      const createdEvent = await res.json();
      const normalized = normalizeEvent(createdEvent);

      setEvents((prev) => [...prev, normalized]);
      setSelectedEventId(normalized.id);

      setNewEventForm({
        name: "",
        date: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      setError("שגיאה ביצירת אירוע חדש");
    }
  };

  // ------------ הוספת הוצאה ------------
  const handleAddExpense = async (eventId, expenseData) => {
    try {
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/expenses`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(expenseData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add expense");
      }

      const newExpense = await res.json();

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id !== eventId
            ? ev
            : {
                ...ev,
                expenses: [
                  ...ev.expenses,
                  { ...newExpense, id: newExpense.id || newExpense._id },
                ],
              }
        )
      );
    } catch (err) {
      console.error(err);
      setError("שגיאה בהוספת הוצאה");
    }
  };

  // ------------ עדכון הוצאה ------------
  const handleUpdateExpense = async (eventId, expenseId, updatedData) => {
    try {
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update expense");
      }

      const updatedExpense = await res.json();

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id !== eventId
            ? ev
            : {
                ...ev,
                expenses: ev.expenses.map((exp) =>
                  exp.id === expenseId || exp._id === expenseId
                    ? {
                        ...updatedExpense,
                        id: updatedExpense.id || updatedExpense._id,
                      }
                    : exp
                ),
              }
        )
      );
    } catch (err) {
      console.error(err);
      setError("שגיאה בעדכון הוצאה");
    }
  };

  // ------------ מחיקת הוצאה ------------
  const handleDeleteExpense = async (eventId, expenseId) => {
    try {
      setError(null);

      const res = await fetch(
        `${API_BASE_URL}/api/events/${eventId}/expenses/${expenseId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete expense");
      }

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id !== eventId
            ? ev
            : {
                ...ev,
                expenses: ev.expenses.filter(
                  (exp) =>
                    exp.id !== expenseId && exp._id !== expenseId
                ),
              }
        )
      );
    } catch (err) {
      console.error(err);
      setError("שגיאה במחיקת הוצאה");
    }
  };

  // ------------ מחיקת אירוע ------------
  const handleDeleteEvent = async (eventId) => {
    try {
      setError(null);

      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete event");
      }

      setEvents((prev) => {
        const filtered = prev.filter((ev) => ev.id !== eventId);

        if (filtered.length === 0) {
          setSelectedEventId(null);
        } else if (eventId === selectedEventId) {
          setSelectedEventId(filtered[0].id);
        }

        return filtered;
      });
    } catch (err) {
      console.error(err);
      setError("שגיאה במחיקת אירוע");
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1>מנתח הוצאות אירועים</h1>
      </header>

      <main className="app-layout">
        <section className="app-sidebar">
          <h2>אירועים</h2>

          {loading && <p>טוען אירועים מהשרת...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && (
            <>
              <EventList
                events={events}
                selectedEventId={selectedEventId}
                onSelect={setSelectedEventId}
              />

              <div className="add-event-card">
                <h3>הוספת אירוע</h3>
                <form className="add-event-form" onSubmit={handleCreateEvent}>
                  <div className="form-row">
                    <label>
                      שם אירוע:
                      <input
                        name="name"
                        value={newEventForm.name}
                        onChange={handleNewEventChange}
                        placeholder="לדוגמה: שבת חתן"
                      />
                    </label>
                  </div>

                  <div className="form-row">
                    <label>
                      תאריך:
                      <input
                        type="date"
                        name="date"
                        value={newEventForm.date}
                        onChange={handleNewEventChange}
                      />
                    </label>
                  </div>

                  <div className="form-row">
                    <label>
                      הערות:
                      <textarea
                        name="notes"
                        value={newEventForm.notes}
                        onChange={handleNewEventChange}
                        rows={2}
                        placeholder="הערות חופשיות"
                      />
                    </label>
                  </div>

                  <button type="submit" className="primary-btn full-width">
                    יצירת אירוע חדש
                  </button>
                </form>
              </div>
            </>
          )}
        </section>

        <section className="app-content">
          {loading ? (
            <p>טוען...</p>
          ) : selectedEvent ? (
            <EventDetails
              event={selectedEvent}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              onDeleteEvent={handleDeleteEvent}
            />
          ) : (
            <p>אין אירועים במערכת עדיין. תצרי אחד חדש בצד שמאל.</p>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
