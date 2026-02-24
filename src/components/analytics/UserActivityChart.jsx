import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";

// Format date to 'DD Mon' with safe error handling
function parseDate(dateStr) {
  try {
    if (!dateStr || typeof dateStr !== 'string' || dateStr.length !== 8) {
      return null;
    }
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    // console.error('Error parsing date:', error, dateStr);
    return null;
  }
}

export default function UserActivityChart({ dateRange }) {
  const [chartData, setChartData] = useState([["Date", "Active Users"]]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'date'
  const [dataGranularity, setDataGranularity] = useState('month'); // 'year', 'month', 'day'

  useEffect(() => {
    async function fetchUserActivitySummary() {
      try {
        setLoading(true);
        const customRangeActive = !!(dateRange && dateRange.startDate && dateRange.endDate);
        setIsCustomRange(customRangeActive);

        const API_BASE_URL = "http://localhost:4000";
        
        // Determine data granularity based on date range
        let granularity = 'month';
        let period = 'month';
        
        if (customRangeActive) {
          const daysDiff = Math.ceil((dateRange.endDate - dateRange.startDate) / (1000 * 60 * 60 * 24));
          
          if (daysDiff > 365) {
            granularity = 'year';
            period = 'year';
          } else if (daysDiff > 90) {
            granularity = 'month';
            period = 'month';
          } else if (daysDiff > 31) {
            granularity = 'month';
            period = 'month';
          } else {
            granularity = 'day';
            period = 'day';
          }
        } else {
          // Default to month view for 6-month range
          granularity = 'month';
          period = 'month';
          setViewMode('month');
        }
        
        setDataGranularity(granularity);
        
        let url = `${API_BASE_URL}/api/analytics/user-activity-summary`;
        
        if (customRangeActive) {
          const startDate = dateRange.startDate.toISOString().split('T')[0];
          const endDate = dateRange.endDate.toISOString().split('T')[0];
          const params = new URLSearchParams({
            startDate: startDate,
            endDate: endDate,
          });
          url += `?${params.toString()}`;
        } else {
          // Default to last 6 months
          const endDate = new Date();
          const startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 6);
          
          const startDateStr = startDate.toISOString().split('T')[0];
          const endDateStr = endDate.toISOString().split('T')[0];
          
          url += `?startDate=${startDateStr}&endDate=${endDateStr}`;
          console.log('📅 Default 6-month range:', startDateStr, 'to', endDateStr);
        }

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        console.log('📊 UserActivityChart Raw API Response:', json);
        if (!json || typeof json !== 'object') throw new Error('Invalid API response format');

        // Handle API response - expects array of data points from /api/analytics
        const apiData = Array.isArray(json) ? json : [];
        console.log('📈 UserActivityChart Processed API Data:', apiData);
        
        if (apiData.length === 0) {
          setChartData([["Date", "Active Users"]]);
          setStats([]);
          return;
        }

        // Process data points for chart - format dates for Google Charts
        const rows = apiData.map(item => {
          // Parse YYYYMMDD format to Date object and convert to string format
          const dateStr = item.date;
          console.log('🗓️ Processing date string:', dateStr);
          if (dateStr && dateStr.length === 8) {
            const year = parseInt(dateStr.substring(0, 4));
            const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-indexed
            const day = parseInt(dateStr.substring(6, 8));
            const date = new Date(year, month, day);
            
            if (date && !isNaN(date.getTime())) {
              // Format date as YYYY-MM-DD string for Google Charts
              const formattedDate = date.toISOString().split('T')[0];
              const result = [formattedDate, parseInt(item.activeUsers) || 0];
              console.log('📅 Converted date:', date, '-> formatted:', formattedDate, '-> result:', result);
              return result;
            }
          }
          console.log('❌ Invalid date format:', dateStr);
          return null;
        }).filter(Boolean);
        
        console.log('📊 Final chart data rows:', rows);
        
        // console.log('Final chart data rows:', rows);

        // Calculate statistics based on date range
        const totalUsers = apiData.reduce((sum, d) => sum + (parseInt(d.activeUsers) || 0), 0);
        const avgUsers = Math.round(totalUsers / apiData.length);
        const maxUsers = Math.max(...apiData.map(d => parseInt(d.activeUsers) || 0));
        
        // Calculate trend based on available data
        let trendPercentage = 0;
        let trendSign = '';
        
        if (apiData.length >= 14) {
          // Calculate trend if we have enough data
          const recentData = apiData.slice(-7); // Last 7 data points
          const previousData = apiData.slice(-14, -7); // Previous 7 data points
          const recentAvg = recentData.reduce((sum, d) => sum + (parseInt(d.activeUsers) || 0), 0) / recentData.length;
          const previousAvg = previousData.length > 0 ? previousData.reduce((sum, d) => sum + (parseInt(d.activeUsers) || 0), 0) / previousData.length : recentAvg;
          trendPercentage = previousAvg > 0 ? Math.round(((recentAvg - previousAvg) / previousAvg) * 100) : 0;
          trendSign = trendPercentage >= 0 ? '+' : '';
        }

        setChartData([["Date", "Active Users"], ...rows]);
        
        // Dynamic stats based on date range
        if (customRangeActive) {
          setStats([
            { label: "Total Users", value: totalUsers, color: "blue", icon: "👥", trend: `${trendSign}${trendPercentage}%` },
            { label: "Average Daily", value: avgUsers, color: "green", icon: "📊", trend: `${trendSign}${Math.round(trendPercentage/2)}%` },
            { label: "Peak Activity", value: maxUsers, color: "orange", icon: "⚡", trend: "Peak" },
          ]);
        } else {
          // Default month view stats
          setStats([
            { label: "Month Total", value: totalUsers, color: "blue", icon: "📅", trend: `${trendSign}${trendPercentage}%` },
            { label: "Daily Average", value: avgUsers, color: "green", icon: "📈", trend: `${trendSign}${Math.round(trendPercentage/2)}%` },
            { label: "Daily Peak", value: maxUsers, color: "orange", icon: "🚀", trend: "Max" },
          ]);
        }
      } catch (e) {
        console.error("Failed to fetch API data:", e.message);
        setChartData([["Date", "Active Users"]]);
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    
    // Call the function
    fetchUserActivitySummary();
  }, [dateRange.startDate, dateRange.endDate, dataGranularity]);

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg text-center text-gray-700">
        Loading user activity...
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 h-full ">
      <div className="relative z-10 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
               </svg>
             </div>
             <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                User Activity Overtime
              </h2>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => setViewMode('year')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'year' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Year
                </button>
                <button
                  onClick={() => setViewMode('month')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'month' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Month
                </button>
                <button
                  onClick={() => setViewMode('date')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    viewMode === 'date' 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Date Range
                </button>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                {viewMode === 'date' && dateRange?.startDate && dateRange?.endDate 
                  ? `Activity from ${dateRange.startDate.toLocaleDateString()} to ${dateRange.endDate.toLocaleDateString()}`
                  : viewMode === 'month' 
                    ? 'Monthly activity overview'
                    : 'Activity for selected period'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-4 gap-8 h-[300px]">
        <div className="lg:col-span-3 h-full">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100/50 h-full p-8">
            <div className="h-full w-full">
              <Chart
                chartType={viewMode === 'month' ? "AreaChart" : viewMode === 'date' ? "LineChart" : "ColumnChart"}
                width="100%"
                height="100%"
                data={chartData}
                options={{
                  legend: "none",
                  backgroundColor: "transparent",
                  chartArea: { 
                    left: 80, 
                    top: 40, 
                    right: 40, 
                    bottom: 80 
                  },
                  hAxis: {
                    format: viewMode === 'year' ? 'yyyy' : viewMode === 'month' ? 'MMM yy' : 'MMM d',
                    textStyle: { 
                      color: "#6b7280", 
                      fontSize: 12,
                      fontName: 'Inter'
                    },
                    gridlines: { 
                      color: "transparent" 
                    },
                    baselineColor: "#f3f4f6",
                    slantedText: true,
                    slantedTextAngle: 45
                  },
                  vAxis: {
                    textStyle: { 
                      color: "#6b7280", 
                      fontSize: 12,
                      fontName: 'Inter'
                    },
                    gridlines: { 
                      color: "#e5e7eb",
                      count: -1
                    },
                    baselineColor: "#f3f4f6",
                    minValue: 0,
                    format: "#",
                  },
                  colors: [{
                    color: "#3b82f6",
                    fill: viewMode === 'month' ? "#3b82f6" : "transparent",
                    fillOpacity: viewMode === 'month' ? 0.8 : 0.1
                  }],
                  lineWidth: 2.5,
                  pointSize: viewMode === 'month' ? 0 : (viewMode === 'date' ? 4 : 6),
                  curveType: "function",
                  interpolateNulls: false,
                  areaOpacity: viewMode === 'month' ? 0.8 : 0.1
                }}
                // onError={(error) => console.error('Google Charts error:', error)}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col h-full space-y-6">
          {stats.map(stat => (
            <StatCard 
              key={stat.label}
              label={stat.label} 
              value={stat.value} 
              color={stat.color} 
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon, trend }) {
  const colorConfig = {
    blue: {
      bg: "from-blue-500 to-blue-600",
      light: "from-blue-50 to-blue-100",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    green: {
      bg: "from-emerald-500 to-emerald-600",
      light: "from-emerald-50 to-emerald-100",
      text: "text-emerald-600",
      border: "border-emerald-200"
    },
    orange: {
      bg: "from-amber-500 to-amber-600",
      light: "from-amber-50 to-amber-100",
      text: "text-amber-600",
      border: "border-amber-200"
    }
  };
  
  const config = colorConfig[color];
  
  return (
    <div className={`bg-gradient-to-br ${config.light} border ${config.border} rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden`}>
      {/* Background accent */}
      <div className={`absolute top-0 left-0 w-0.5 h-full ${config.accent} opacity-70`}></div>
      
      {/* Header with icon and trend */}
      <div className="flex items-center justify-between mb-2">
        <div className={`w-7 h-7 bg-gradient-to-br ${config.bg} rounded-md flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform duration-300`}>
          <span className="text-xs">{icon}</span>
        </div>
        <div className={`text-xs font-medium ${config.text} bg-white/70 px-1.5 py-0.5 rounded-full text-[10px]`}>
          {trend}
        </div>
      </div>
      
      {/* Content */}
      <div className="space-y-0.5">
        <div className={`text-xl font-bold ${config.text} leading-tight`}>
          {value ? value.toLocaleString() : '0'}
        </div>
        <div className="text-xs text-slate-500 font-medium">{label}</div>
      </div>
    </div>
  );
}

