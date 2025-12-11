import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// מערך צבעים גדול
const COLORS = [
  "#3498db", "#e74c3c", "#f1c40f", "#9b59b6", "#16a085",
  "#e67e22", "#2ecc71", "#1abc9c", "#34495e", "#8e44ad",
  "#d35400", "#c0392b", "#27ae60", "#2980b9", "#7f8c8d",
  "#95a5a6", "#f39c12", "#8e44ad", "#2c3e50", "#bdc3c7"
];

// גיבוי – אם יש יותר קטגוריות ממספר הצבעים, ניצור צבע לפי אינדקס
function getColor(index) {
  if (index < COLORS.length) return COLORS[index];
  const hue = (index * 37) % 360; // זזים על הגלגל
  return `hsl(${hue}, 70%, 55%)`;
}

function CategoryChart({ data }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const enrichedData = data.map((item) => ({
    ...item,
    percent: Math.round((item.value / total) * 100),
  }));

  return (
    <div className="category-chart-card">
      <h3>פירוט הוצאות לפי קטגוריה</h3>

      <div style={{ width: "100%", height: 350, display: "flex" }}>
        {/* עוגה מלאה */}
        <div style={{ flex: 1 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={enrichedData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                paddingAngle={2}
              >
                {enrichedData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={getColor(index)}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => `${value.toLocaleString()} ₪`}
                labelFormatter={(label) => `קטגוריה: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* מקרא בצד */}
        <div
          style={{
            width: 240,
            paddingRight: 15,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          {enrichedData.map((item, index) => (
            <div
              key={item.name}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  backgroundColor: getColor(index),
                  borderRadius: 3,
                }}
              />
              <span>
                {item.name} — {item.percent}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryChart;
