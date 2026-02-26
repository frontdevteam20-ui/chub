import React, { useState } from 'react';
import Navbar from '../Navbar';
import HamburgerMenu from '../HamburgerMenu';
import AnalyticsCards from '../analytics/acquisition/AnalyticsCards';
import ChartSection from '../analytics/acquisition/ChartSection';
import DataTable from '../analytics/acquisition/DataTable';
import DateRangePicker from './DateRangePicker';
import { chartOptions } from '../analytics/acquisition/constants';

// Dates array from constants
const chartDates = [
  '09 Jul','11 Jul','13 Jul','15 Jul','17 Jul','19 Jul','21 Jul','23 Jul','25 Jul','27 Jul','29 Jul','31 Jul','01 Aug','03 Aug','05 Aug','07 Aug','09 Aug','11 Aug'
];
const chartChannels = ['google', 'referral', 'organic search' , 'social'];

// Helper to generate chart data from tableData for Google Charts
function getChartData(tableData) {
  // Prepare header: Date + channels
  const header = ['Date', ...chartChannels.map(c => c.charAt(0).toUpperCase() + c.slice(1))];
  // For each date, build a row with values for each channel
  const rows = chartDates.map(date => {
    // For each channel, find the matching tableData entry
    const values = chartChannels.map(channel => {
      const match = tableData.find(row =>
        row.date === date && row.channel && row.channel.toLowerCase().includes(channel)
      );
      return match ? Number(match.totalUsers) || 0 : 0;
    });
    return [date, ...values];
  });
  return [header, ...rows];
}




export default function Acquisition({ handleLogout }) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const [timeframe, setTimeframe] = useState('Day');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [tempStartDate, setTempStartDate] = useState(null);
  const [tempEndDate, setTempEndDate] = useState(null);
  const [analyticsData, setAnalyticsData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(true);
  const [tableError, setTableError] = useState(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      if (!dateRange.startDate || !dateRange.endDate) return;
      setLoading(true);
      setError(null);
      try {
        
        const url = new URL('https://chub-j3ha.onrender.com/api/analytics/user-acquisition-summary', window.location.origin);
        url.searchParams.append('startDate', dateRange.startDate.toISOString().split('T')[0]);
        url.searchParams.append('endDate', dateRange.endDate.toISOString().split('T')[0]);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch analytics summary');
        const data = await res.json();
        setAnalyticsData({
          sessions: data.sessions,
          avgEngagementTime: `${Math.round(data.averageEngagementTimePerActiveUser)}s`,
          keyEvents: data.totalKeyEvents,
          bounceRate: (data.bounceRate * 100).toFixed(2)
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRange]);

  React.useEffect(() => {
    const fetchTableData = async () => {
      if (!dateRange.startDate || !dateRange.endDate) return;
      setTableLoading(true);
      setTableError(null);
      try {
        
        const url = new URL('https://chub-j3ha.onrender.com/api/analytics/traffic-acquisition', window.location.origin);
        url.searchParams.append('startDate', dateRange.startDate.toISOString().split('T')[0]);
        url.searchParams.append('endDate', dateRange.endDate.toISOString().split('T')[0]);
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch traffic acquisition data');
        const apiData = await res.json();
        // Transform API data to DataTable format
        const rows = apiData.rows || [];
        // Calculate totalUsers sum for percentage
        const totalUsersSum = rows.reduce((acc, row) => acc + (row.totalUsers || 0), 0);
        const mapped = rows.map(row => {
          // Format avgEngagementTime as 'Xm Ys'
          let avgEngagementTime = row.averageSessionDuration || 0;
          let minutes = Math.floor(avgEngagementTime / 60);
          let seconds = Math.round(avgEngagementTime % 60);
          let avgEngagementTimeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
          // Calculate percentage
          let percentage = totalUsersSum > 0 ? `${((row.totalUsers / totalUsersSum) * 100).toFixed(1)}%` : '0%';
          // Calculate userKeyEventRate
          let userKeyEventRate = row.totalUsers > 0 && row.keyEvents ? `${((row.keyEvents / row.totalUsers) * 100).toFixed(1)}%` : '0%';
          return {
            date: row.date, // <-- ensure date is available for chart mapping
            channel: row.sessionSource || row.channel || row.pageTitle || '-',
            totalUsers: row.totalUsers || 0,
            newUsers: row.newUsers || 0,
            returningUsers: row.returningUsers || 0,
            avgEngagementTime: avgEngagementTimeStr,
            engagedSessions: row.engagedSessions || 0,
            eventCount: row.eventCount || 0,
            keyEvents: row.keyEvents || 0,
            userKeyEventRate,
            percentage
          };
        });
        setTableData(mapped);
        setCurrentPage(1); // Reset to first page on new data
      } catch (err) {
        setTableError(err.message);
      } finally {
        setTableLoading(false);
      }
    };
    fetchTableData();
  }, [dateRange]);

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      <Navbar handleLogout={handleLogout} />
      <div className="flex flex-1 w-full pt-15">
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>
        <div className="flex-1 max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6 mt-5">
            <h1 className="text-2xl font-bold text-gray-900">Acquisition Analytics</h1>
            <DateRangePicker 
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={setDateRange}
            />
          </div>

          {loading ? (
            <div className="mb-8">Loading analytics...</div>
          ) : error ? (
            <div className="mb-8 text-red-600">{error}</div>
          ) : (
            <AnalyticsCards analyticsData={analyticsData} />
          )}
          <ChartSection dateRange={dateRange} />
          {tableLoading ? (
            <div className="mb-8">Loading table data...</div>
          ) : tableError ? (
            <div className="mb-8 text-red-600">{tableError}</div>
          ) : (
            <DataTable
              tableData={tableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              totalRows={tableData.length}
              setCurrentPage={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
