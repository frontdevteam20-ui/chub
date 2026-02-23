import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const METRICS = [
  { value: 'activeUsers', label: 'Active Users' },
  { value: 'newUsers', label: 'New Users' },
  { value: 'screenPageViews', label: 'Screen Page Views' },
  { value: 'userEngagementDuration', label: 'User Engagement Duration' },
  { value: 'sessions', label: 'Sessions' },
  { value: 'engagedSessions', label: 'Engaged Sessions' },
  { value: 'averageSessionDuration', label: 'Average Session Duration' },
  { value: 'bounceRate', label: 'Bounce Rate' },
];

const DURATION_METRICS = [
  'averageSessionDuration',
  'userEngagementDuration',
];

const DIMENSIONS = [
  'date',
  'country',
  'city',
  'deviceCategory',
  'browser',
  'pagePath',
];

function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function Analytics({ dateRange }) {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('day');
  const [selectedMetric, setSelectedMetric] = useState(METRICS[0].value);

  // Extract unique device categories and page paths for dropdowns
  const deviceCategories = React.useMemo(() => {
    const set = new Set(analyticsData.map(row => row.deviceCategory).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [analyticsData]);

  const pagePaths = React.useMemo(() => {
    const set = new Set(analyticsData.map(row => row.pagePath).filter(Boolean));
    return ['All', ...Array.from(set)];
  }, [analyticsData]);

  const [selectedDevice, setSelectedDevice] = useState('All');
  const [selectedPage, setSelectedPage] = useState('All');

  // Filter data by device and page
  const filteredData = analyticsData.filter(row =>
    (selectedDevice === 'All' || row.deviceCategory === selectedDevice) &&
    (selectedPage === 'All' || row.pagePath === selectedPage)
  );

  useEffect(() => {
    fetchAnalyticsData();
    // eslint-disable-next-line
  }, [period, selectedMetric, dateRange.startDate, dateRange.endDate]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const metric = selectedMetric;
      const dimensions = DIMENSIONS.join(',');
      const API_BASE_URL = "http://192.168.0.31:4000";
      
      // Build URL with date range if provided
      let url = `${API_BASE_URL}/api/analytics?period=${period}&metric=${metric}&dimensions=${dimensions}`;
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        const startDate = dateRange.startDate.toISOString().split('T')[0];
        const endDate = dateRange.endDate.toISOString().split('T')[0];
        url += `&startDate=${startDate}&endDate=${endDate}`;
      }
      
      console.log('📊 Analytics API URL:', url);
      console.log('📅 Analytics Date Range:', dateRange);
      
      const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      console.log('API Response:', data);
      
      // Add default values for missing dimensions and format dates
      const processedData = Array.isArray(data) ? data.map(item => ({
        ...item,
        date: formatDate(item.date), // Format YYYYMMDD to YYYY-MM-DD
        country: item.country || 'Unknown',
        city: item.city || 'Unknown',
        deviceCategory: item.deviceCategory || 'Unknown',
        browser: item.browser || 'Unknown',
        pagePath: item.pagePath || '/',
      })) : [];
      
      setAnalyticsData(processedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load analytics data. Make sure the analytics server is running on port 4000.');
    } finally {
      setLoading(false);
    }
  };

  // Format date (YYYYMMDD or ISO)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    if (/^\d{8}$/.test(dateString)) {
      // Google Analytics date format: YYYYMMDD
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  // Chart data: use processedData directly with formatted dates
  const chartData = filteredData.map(row => ({
    date: row.date, // Already formatted by formatDate()
    [selectedMetric]: parseFloat(row[selectedMetric]) || 0
  }));

  // Tooltip formatter for chart
  const chartTooltipFormatter = (value) => {
    if (DURATION_METRICS.includes(selectedMetric)) {
      return [formatDuration(value), METRICS.find(m => m.value === selectedMetric)?.label || selectedMetric];
    }
    return [value, METRICS.find(m => m.value === selectedMetric)?.label || selectedMetric];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-0 flex flex-col h-[90vh] max-h-[700px] min-h-[320px] w-full border border-gray-100 relative overflow-hidden">
      {/* Accent bar */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-400 mb-2" />
      {/* Header and controls */}
      <div className="flex flex-col gap-2 px-2 sm:px-4 pt-2 pb-2">
        <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 tracking-tight mb-1">Google Analytics Overview</h3>
        {/* Desktop: 4-column grid. Mobile: device/page/metric row, period below. */}
        <div className="hidden md:grid grid-cols-4 gap-2 w-full">
          {/* Period Buttons */}
          <div className="flex gap-2 w-full">
            {['day', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`w-full px-3 py-1 rounded text-xs sm:text-sm font-medium transition-colors duration-150 ${
                  period === p
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
          {/* Metric Dropdown */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="w-full px-3 py-1 rounded border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            {METRICS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          {/* Device Dropdown */}
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="w-full px-3 py-1 rounded border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            {deviceCategories.map((d) => (
              <option key={d} value={d}>{d === 'All' ? 'All Devices' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
          {/* Page Dropdown */}
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full px-3 py-1 rounded border border-gray-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
          >
            {pagePaths.map((p) => (
              <option key={p} value={p}>{p === 'All' ? 'All Pages' : p}</option>
            ))}
          </select>
        </div>
        {/* Mobile: device/page/metric row, period below */}
        <div className="flex flex-col gap-2 w-full md:hidden">
          <div className="flex flex-row gap-2 w-full">
            {/* Device Dropdown */}
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-1/3 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              {deviceCategories.map((d) => (
                <option key={d} value={d}>{d === 'All' ? 'All Devices' : d.charAt(0).toUpperCase() + d.slice(1)}</option>
              ))}
            </select>
            {/* Page Dropdown */}
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-1/3 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              {pagePaths.map((p) => (
                <option key={p} value={p}>{p === 'All' ? 'All Pages' : p}</option>
              ))}
            </select>
            {/* Metric Dropdown */}
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="w-1/3 px-2 py-1 rounded border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
            >
              {METRICS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          {/* Period Buttons below */}
          <div className="flex gap-2 w-full mt-2">
            {['day', 'week', 'month'].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`w-full px-3 py-1 rounded text-xs font-medium transition-colors duration-150 ${
                  period === p
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div
        className="w-full flex-shrink-0 px-2 sm:px-4 mb-0"
        style={{ height: '160px', minHeight: '120px', maxHeight: '320px' }}
      >
        <div className="hidden md:block" style={{ height: '260px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-xs sm:text-sm">Loading analytics data...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              <p className="mb-2">⚠️ {error}</p>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" style={{ minHeight: '200px' }}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  labelFormatter={formatDate}
                  formatter={chartTooltipFormatter}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="md:hidden" style={{ height: '160px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-xs sm:text-sm">Loading analytics data...</span>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">
              <p className="mb-2">⚠️ {error}</p>
              <button
                onClick={fetchAnalyticsData}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" style={{ minHeight: '200px' }}>
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={formatDate} fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip
                  labelFormatter={formatDate}
                  formatter={chartTooltipFormatter}
                />
                <Area
                  type="monotone"
                  dataKey={selectedMetric}
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorMetric)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Divider below chart for clear separation */}
      <div className="w-full border-b border-gray-200 mt-4 mb-0" />

      {/* Card view for mobile (below md) */}
      <div className="block md:hidden flex-1 overflow-y-auto mt-8 px-2">
        {filteredData.length === 0 ? (
          <div className="text-center text-gray-400 py-4">No data available</div>
        ) : (
          <div className="space-y-3">
            {filteredData.map((row, idx) => (
              <div key={idx} className="rounded-xl border border-gray-100 bg-gray-50 p-3 shadow-sm">
                {DIMENSIONS.map((dim) => (
                  <div key={dim} className="flex justify-between items-center py-0.5 text-xs">
                    <span className="font-semibold text-gray-500 mr-2">{dim.charAt(0).toUpperCase() + dim.slice(1)}:</span>
                    <span className={dim === 'pagePath' ? 'truncate max-w-[120px] text-blue-700' : 'text-gray-800'} title={row[dim] || ''}>
                      {dim === 'date'
                        ? formatDate(row[dim])
                        : dim === 'pagePath' && row[dim]
                          ? row[dim]
                          : (row[dim] || '-')}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between items-center py-0.5 text-xs mt-1">
                  <span className="font-semibold text-gray-500 mr-2">{METRICS.find(m => m.value === selectedMetric)?.label || selectedMetric}:</span>
                  <span className="text-blue-700 font-semibold">
                    {DURATION_METRICS.includes(selectedMetric)
                      ? formatDuration(parseFloat(row[selectedMetric]))
                      : (row[selectedMetric] || '-')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Table for md+ screens */}
      <div className="hidden md:block flex-1 mt-8 px-0 sm:px-4" style={{ height: '300px' }}>
        <div className="rounded-xl border border-gray-100 bg-white h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <table className="min-w-[600px] w-full text-xs sm:text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-b-2 border-blue-200 shadow-sm">
                    {DIMENSIONS.map((dim, index) => (
                      <th key={dim} className="px-2 sm:px-3 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap relative group">
                        <div className="flex items-center justify-center space-x-1">
                          <span className="text-xs opacity-60">#{index + 1}</span>
                          <span className="text-sm">{dim.charAt(0).toUpperCase() + dim.slice(1)}</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </th>
                    ))}
                    <th className="px-2 sm:px-3 py-3 text-center font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap relative group bg-gradient-to-r from-green-50 to-emerald-50 border-l border-green-200">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-xs opacity-60">📊</span>
                        <span className="text-sm">{METRICS.find(m => m.value === selectedMetric)?.label || selectedMetric}</span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={DIMENSIONS.length + 1} className="text-center text-gray-400 py-4">No data available</td>
                    </tr>
                  ) : (
                    filteredData.map((row, idx) => (
                      <tr
                        key={idx}
                        className={
                          `${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} transition hover:bg-blue-50/70` +
                          ' border-b border-gray-100 last:border-b-0'
                        }
                      >
                        {DIMENSIONS.map((dim) => (
                          <td
                            key={dim}
                            className={
                              'px-2 sm:px-3 py-2 text-gray-700 whitespace-nowrap rounded-lg' +
                              (dim === 'pagePath' ? ' max-w-[90px] xs:max-w-[120px] sm:max-w-[200px] truncate cursor-pointer group relative' : '')
                            }
                            title={dim === 'pagePath' && row[dim] ? row[dim] : undefined}
                          >
                            {dim === 'date'
                              ? formatDate(row[dim])
                              : dim === 'pagePath' && row[dim]
                                ? (
                                  <span className="block truncate group-hover:underline" title={row[dim]}>{row[dim]}</span>
                                )
                                : (row[dim] || '-')}
                          </td>
                        ))}
                        <td className="px-2 sm:px-3 py-2 text-blue-700 font-semibold whitespace-nowrap rounded-lg">
                          {DURATION_METRICS.includes(selectedMetric)
                            ? formatDuration(parseFloat(row[selectedMetric]))
                            : (row[selectedMetric] || '-')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-xs sm:text-sm text-gray-500 text-center px-2 pb-2">
        Data from Google Analytics API (Port 4000)
      </div>
    </div>
  );
}

export default Analytics; 


