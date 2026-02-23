
import React, { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const API_BASE_URL = "https://6f34e00f9e13.ngrok-free.app";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch stats (totals for the week)
        const statsRes = await fetch(`${API_BASE_URL}/api/analytics?period=week&metric=activeUsers,newUsers,sessions,purchases,revenue`);
        const statsJson = await statsRes.json();
        setStats(statsJson[0] || {});

        // Fetch chart data (sessions per day for the last month)
        const chartRes = await fetch(`${API_BASE_URL}/api/analytics?period=month&metric=sessions&dimensions=date`);
        const chartJson = await chartRes.json();
        // Optionally format date for recharts
        const formattedChart = chartJson.map(row => ({
          ...row,
          date: row.date && row.date.length === 8 ? `${row.date.slice(0,4)}-${row.date.slice(4,6)}-${row.date.slice(6,8)}` : row.date,
          sessions: Number(row.sessions)
        }));
        setChartData(formattedChart);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div>
      <h1>Web Analytics Dashboard</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div>Total Users: {stats.activeUsers}</div>
            <div>New Users: {stats.newUsers}</div>
            <div>Sessions: {stats.sessions}</div>
            <div>Purchases: {stats.purchases}</div>
            <div>Revenue: {stats.revenue}</div>
          </div>
          {/* Chart Example */}
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="sessions" stroke="#8884d8" fillOpacity={1} fill="url(#colorSessions)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;