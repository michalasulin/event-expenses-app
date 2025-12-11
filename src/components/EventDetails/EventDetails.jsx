import React, { useMemo, useState } from "react";
import CategoryChart from "../CategoryChart/CategoryChart.jsx";

function EventDetails({
  event,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
  onDeleteEvent,
}) {
  const { name, date, notes, expenses } = event;

  // ------- סכומים כלליים -------
  const totalAmount = useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const paidSum = useMemo(() => {
    if (!expenses || expenses.length === 0) return 0;
    return expenses
      .filter((exp) => exp.status === "paid")
      .reduce((sum, exp) => sum + exp.amount, 0);
  }, [expenses]);

  const unpaidSum = totalAmount - paidSum;
  const totalForPercent = totalAmount || 1;

  // ------- סכום לפי קטגוריה לגרף/תובנות -------
  const categoryTotals = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const map = {};
    expenses.forEach((exp) => {
      if (!map[exp.category]) {
        map[exp.category] = 0;
      }
      map[exp.category] += exp.amount;
    });

    return Object.entries(map).map(([name, total]) => ({
      name,
      value: total,
    }));
  }, [expenses]);

  const top3Categories = useMemo(() => {
    if (!categoryTotals || categoryTotals.length === 0) return [];
    const sorted = [...categoryTotals].sort((a, b) => b.value - a.value);
    return sorted.slice(0, 3);
  }, [categoryTotals]);

  const mainInsight = useMemo(() => {
    if (!categoryTotals || categoryTotals.length === 0) {
      return "עדיין לא הוזנו מספיק נתונים להפקת תובנות.";
    }

    const sorted = [...categoryTotals].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const percent = Math.round((top.value / totalForPercent) * 100);

    return `הקטגוריה הגדולה ביותר אצלך כרגע היא "${top.name}" עם כ-${percent}% מסך ההוצאות.`;
  }, [categoryTotals, totalForPercent]);

  // ------- פילטרים לטבלת הוצאות -------
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
  });

  const distinctCategories = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];
    const set = new Set(expenses.map((exp) => exp.category));
    return Array.from(set);
  }, [expenses]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    return expenses.filter((exp) => {
      const matchSearch =
        !filters.search ||
        exp.description.toLowerCase().includes(filters.search.toLowerCase());

      const matchStatus =
        filters.status === "all" ? true : exp.status === filters.status;

      const matchCategory =
        filters.category === "all" ? true : exp.category === filters.category;

      return matchSearch && matchStatus && matchCategory;
    });
  }, [expenses, filters]);

  // ------- טופס הוספת הוצאה -------
  const [form, setForm] = useState({
    description: "",
    category: "",
    amount: "",
    status: "unpaid",
    paymentMethod: "other",
  });

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();

    if (!form.description || !form.category || !form.amount) {
      alert("תיאור, קטגוריה וסכום הם שדות חובה");
      return;
    }

    const expenseData = {
      description: form.description,
      category: form.category,
      amount: Number(form.amount),
      status: form.status,
      paymentMethod: form.paymentMethod,
      notes: "",
    };

    onAddExpense(event.id, expenseData);

    setForm((prev) => ({ ...prev, description: "", amount: "" }));
  };

  // ------- עריכת הוצאה -------
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    amount: "",
    status: "unpaid",
    paymentMethod: "other",
  });

  const handleEditClick = (exp) => {
    setEditingExpenseId(exp.id);
    setEditForm({
      description: exp.description,
      category: exp.category,
      amount: String(exp.amount),
      status: exp.status,
      paymentMethod: exp.paymentMethod || "other",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditCancel = () => {
    setEditingExpenseId(null);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!editingExpenseId) return;

    if (!editForm.description || !editForm.category || !editForm.amount) {
      alert("תיאור, קטגוריה וסכום הם שדות חובה");
      return;
    }

    const updatedData = {
      description: editForm.description,
      category: editForm.category,
      amount: Number(editForm.amount),
      status: editForm.status,
      paymentMethod: editForm.paymentMethod,
      notes: "",
    };

    onUpdateExpense(event.id, editingExpenseId, updatedData);
    setEditingExpenseId(null);
  };

  const handleDeleteEventClick = () => {
    if (window.confirm("למחוק את כל האירוע וההוצאות שלו?")) {
      onDeleteEvent(event.id);
    }
  };

  return (
    <div className="event-details">
      <div className="event-details-header">
        <div>
          <h2>{name}</h2>
          <p>תאריך אירוע: {date}</p>
          {notes && <p>הערות: {notes}</p>}
        </div>
        <button className="delete-event-btn" onClick={handleDeleteEventClick}>
          מחיקת אירוע 🗑️
        </button>
      </div>

      {/* סיכום כספי */}
      <div className="event-summary">
        <p>
          <strong>סה"כ הוצאות:</strong> {totalAmount.toLocaleString()} ₪
        </p>
        <p>
          <strong>שולם:</strong> {paidSum.toLocaleString()} ₪
        </p>
        <p>
          <strong>פתוח לתשלום:</strong> {unpaidSum.toLocaleString()} ₪
        </p>
      </div>

      {/* Top 3 */}
      {top3Categories.length > 0 && (
        <div className="top3-card">
          <h3>Top 3 בזבזנים</h3>
          <ol className="top3-list">
            {top3Categories.map((cat, index) => {
              const percent = Math.round((cat.value / totalForPercent) * 100);
              return (
                <li key={cat.name}>
                  <span className="medal">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="top3-name">{cat.name}</span>
                  <span className="top3-amount">
                    {cat.value.toLocaleString()} ₪ ({percent}%)
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      )}

      {/* גרף */}
      {categoryTotals.length > 0 && <CategoryChart data={categoryTotals} />}

      {/* תובנה */}
      <div className="insights-card">
        <h3>תובנות מהאירוע</h3>
        <p>{mainInsight}</p>
      </div>

      {/* טופס הוספת הוצאה */}
      <div className="add-expense-card">
        <h3>הוספת הוצאה</h3>
        <form onSubmit={handleAddSubmit} className="add-expense-form">
          <div className="form-row">
            <label>
              תיאור:
              <input
                name="description"
                value={form.description}
                onChange={handleAddChange}
                placeholder="לדוגמה: אולם"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              קטגוריה:
              <input
                name="category"
                value={form.category}
                onChange={handleAddChange}
                placeholder="אולם / צילום / אוכל..."
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              סכום:
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleAddChange}
                placeholder="לדוגמה: 5000"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              סטטוס:
              <select
                name="status"
                value={form.status}
                onChange={handleAddChange}
              >
                <option value="unpaid">טרם שולם</option>
                <option value="partial">שולם חלקית</option>
                <option value="paid">שולם</option>
              </select>
            </label>

            <label>
              אמצעי תשלום:
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleAddChange}
              >
                <option value="other">אחר</option>
                <option value="cash">מזומן</option>
                <option value="check">צ'ק</option>
                <option value="transfer">העברה</option>
                <option value="card">כרטיס</option>
              </select>
            </label>
          </div>

          <button type="submit" className="primary-btn">
            הוספת הוצאה
          </button>
        </form>
      </div>

      {/* טופס עריכת הוצאה – אם נבחרה */}
      {editingExpenseId && (
        <div className="edit-expense-card">
          <h3>עריכת הוצאה</h3>
          <form onSubmit={handleEditSubmit} className="add-expense-form">
            <div className="form-row">
              <label>
                תיאור:
                <input
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                קטגוריה:
                <input
                  name="category"
                  value={editForm.category}
                  onChange={handleEditChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                סכום:
                <input
                  name="amount"
                  type="number"
                  value={editForm.amount}
                  onChange={handleEditChange}
                />
              </label>
            </div>

            <div className="form-row">
              <label>
                סטטוס:
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                >
                  <option value="unpaid">טרם שולם</option>
                  <option value="partial">שולם חלקית</option>
                  <option value="paid">שולם</option>
                </select>
              </label>

              <label>
                אמצעי תשלום:
                <select
                  name="paymentMethod"
                  value={editForm.paymentMethod}
                  onChange={handleEditChange}
                >
                  <option value="other">אחר</option>
                  <option value="cash">מזומן</option>
                  <option value="check">צ'ק</option>
                  <option value="transfer">העברה</option>
                  <option value="card">כרטיס</option>
                </select>
              </label>
            </div>

            <div className="form-row">
              <button type="submit" className="primary-btn">
                שמירת שינויים
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleEditCancel}
              >
                ביטול
              </button>
            </div>
          </form>
        </div>
      )}

      {/* פילטרים + טבלת הוצאות */}
      <h3>הוצאות</h3>

      <div className="filters-row">
        <div className="filter-item">
          <label>
            חיפוש:
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="חיפוש לפי תיאור"
            />
          </label>
        </div>

        <div className="filter-item">
          <label>
            סטטוס:
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">הכל</option>
              <option value="unpaid">טרם שולם</option>
              <option value="partial">שולם חלקית</option>
              <option value="paid">שולם</option>
            </select>
          </label>
        </div>

        <div className="filter-item">
          <label>
            קטגוריה:
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="all">הכל</option>
              {distinctCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {(!filteredExpenses || filteredExpenses.length === 0) ? (
        <p>לא נמצאו הוצאות בהתאם לפילטרים.</p>
      ) : (
        <table className="expenses-table">
          <thead>
            <tr>
              <th>תיאור</th>
              <th>קטגוריה</th>
              <th>סכום</th>
              <th>סטטוס</th>
              <th>תשלום</th>
              <th>עריכה</th>
              <th>מחיקה</th>
            </tr>
          </thead>
          <tbody>
            {filteredExpenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.description}</td>
                <td>{exp.category}</td>
                <td>{exp.amount.toLocaleString()} ₪</td>
                <td>{exp.status}</td>
                <td>{exp.paymentMethod}</td>
                <td>
                  <button
                    className="secondary-btn"
                    onClick={() => handleEditClick(exp)}
                  >
                    עריכה
                  </button>
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => onDeleteExpense(event.id, exp.id)}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default EventDetails;
