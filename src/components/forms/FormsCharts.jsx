import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// Helper: Get last 7 days labels
function getLast7Days() {
  const days = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
  }
  return days;
}

// Helper: Aggregate forms per day (last 7 days)
function getFormsPerDay(forms) {
  const days = getLast7Days();
  const counts = days.map(label => ({ label, count: 0 }));
  forms.forEach(form => {
    if (!form.timestamp) return;
    const date = new Date(form.timestamp);
    const label = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const idx = days.indexOf(label);
    if (idx !== -1) counts[idx].count++;
  });
  return counts;
}

// Helper: Aggregate forms by status
function getFormsByStatus(forms) {
  const statusMap = { new: 0, in_progress: 0, resolved: 0 };
  forms.forEach(form => {
    const status = form.status || "new";
    if (statusMap[status] !== undefined) statusMap[status]++;
    else statusMap["new"]++;
  });
  return [
    { name: "New", value: statusMap.new },
    { name: "In Progress", value: statusMap.in_progress },
    { name: "Resolved", value: statusMap.resolved },
  ];
}

const STATUS_COLORS = ["#38bdf8", "#facc15", "#4ade80"];

const FormsCharts = ({ forms }) => {
  const formsPerDay = getFormsPerDay(forms);
  const formsByStatus = getFormsByStatus(forms);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8 py-6">
      {/* Bar Chart: Forms per Day */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <h3 className="text-md font-semibold mb-2">Forms per Day (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={formsPerDay} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Pie Chart: Forms by Status */}
      <div className="flex-1 bg-white rounded-xl shadow p-4">
        <h3 className="text-md font-semibold mb-2">Forms by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={formsByStatus}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {formsByStatus.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={STATUS_COLORS[idx % STATUS_COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FormsCharts; 