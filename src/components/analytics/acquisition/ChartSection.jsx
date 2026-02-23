// src/components/analytics/acquisition/ChartSection.jsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Area,
} from 'recharts';
import { FaCalendarAlt } from 'react-icons/fa';


const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Manually format the date label
    const date = new Date(label);
    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });

    return (
      <div className="bg-white p-4 border border-gray-200 shadow-lg rounded-lg">
        <p className="font-semibold text-gray-700">{`${formattedDate}`}</p>
        <div className="mt-2 space-y-1">
          {payload.map((pld, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: pld.stroke }}></span>
                <p className="text-sm text-gray-600">{pld.name}:</p>
              </div>
              <p className="text-sm font-medium text-gray-800">{pld.value}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default function ChartSection({
  dateRange,
  timeframe,
  setTimeframe,
}) {
  const [chartData, setChartData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!dateRange.startDate || !dateRange.endDate) return;
      setLoading(true);
      try {
        const url = new URL('/api/analytics/traffic-acquisition', window.location.origin);
        url.searchParams.append('startDate', dateRange.startDate.toISOString().split('T')[0]);
        url.searchParams.append('endDate', dateRange.endDate.toISOString().split('T')[0]);
        const response = await fetch(url);
        const apiData = await response.json();

        if (!apiData || !apiData.rows) {
          throw new Error('No data returned from API');
        }

        // The API does not provide time-series data. We will simulate it for now.
        // We group data by session source and assign it to dates.
        const sourceMap = {
          'google': 'Organic Search',
          '(direct)': 'Direct',
          'bing': 'Organic Search',
          'facebook.com': 'Organic Social',
          'l.instagram.com': 'Organic Social',
          't.co': 'Organic Social',
        };

        const aggregatedData = apiData.rows.reduce((acc, row) => {
          const source = sourceMap[row.sessionSource] || 'Referral';
          if (!acc[source]) {
            acc[source] = 0;
          }
          acc[source] += parseInt(row.totalUsers, 10);
          return acc;
        }, {});

        // Since the API does not provide time-series data, we'll simulate it.
        // We create a date range and distribute the aggregated data across it.
        const getDatesInRange = (start, end) => {
          const dates = [];
          let currentDate = new Date(start);
          while (currentDate <= end) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        };

        const dates = getDatesInRange(dateRange.startDate, dateRange.endDate).map(d => d.toISOString().split('T')[0]);

        const categories = ['Organic Search', 'Direct', 'Referral', 'Organic Social', 'Unassigned'];
        const processedChartData = dates.map(date => {
          const dataPoint = { date };
          let total = 0;
          categories.forEach(cat => {
            // Distribute the aggregated value over the time period with some randomness
            const value = Math.round((aggregatedData[cat] || 0) / dates.length * (0.8 + Math.random() * 0.4));
            dataPoint[cat] = value;
            total += value;
          });
          dataPoint.Total = total;
          return dataPoint;
        });

        setChartData(processedChartData);

      } catch (err) {
        setError('Failed to fetch or process data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Sessions by Session primary channel group (Default Channel Group) over time12
        </h2>
        <div className="flex items-center space-x-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Day">Day</option>
            <option value="Week">Week</option>
            <option value="Month">Month</option>
          </select>
        </div>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">Loading...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-full text-red-500">{error}</div>
        ) : (
          
          <ResponsiveContainer>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="date" 
                padding={{ left: 20, right: 20 }}
                tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
              />
              <YAxis domain={[0, 200]} ticks={[0, 50, 100, 150, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" iconSize={10} wrapperStyle={{ bottom: -10, left: 20 }} />
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
               <Line type="monotone" dataKey="Total" stroke="#1e40af" strokeWidth={2} strokeDasharray="3 3" dot={false} name="Total" />
              <Line type="monotone" dataKey="Organic Search" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Organic Search" />
              <Line type="monotone" dataKey="Direct" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Direct" />
              <Line type="monotone" dataKey="Referral" stroke="#f97316" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Referral" />
              <Line type="monotone" dataKey="Organic Social" stroke="#6d28d9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Organic Social" />
              <Line type="monotone" dataKey="Unassigned" stroke="#ec4899" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Unassigned" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
