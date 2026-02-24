import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../Navbar';
import HamburgerMenu from '../HamburgerMenu';
import { FaEye, FaUsers, FaChartLine, FaArrowDown } from 'react-icons/fa';
import Analytics from './Analytics';
import EventSummaryCard from './EventSummaryCard';
import UserActivityChart from './UserActivityChart';
import DateRangePicker from './DateRangePicker';

export default function WebAnalytics({ handleLogout }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Set default date range to last 6 months
  const getDefaultDateRange = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    return { startDate, endDate };
  };
  
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        console.log('🔄 fetchAnalytics called with dateRange:', dateRange);
        
        // Always use date range parameters (default 6 months or user selected)
        const startDate = dateRange.startDate.toISOString().split('T')[0];
        const endDate = dateRange.endDate.toISOString().split('T')[0];
        const params = new URLSearchParams({
          startDate: startDate,
          endDate: endDate,
        });

        const response = await fetch(
          `${API_BASE_URL}/api/analytics/totals?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );

        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const json = await response.json();
        
        console.log('📊 WebAnalytics API Response:', json);
        console.log('🌐 API URL:', `${API_BASE_URL}/api/analytics/totals${params ? `?${params.toString()}` : ''}`);
        console.log('📅 Date range:', dateRange);
        
        const data = {
          views: parseInt(json.totalViews) || 0,
          users: parseInt(json.totalUsers) || 0,
          sessions: parseInt(json.totalSessions) || 0,
          events: parseInt(json.totalEvents) || 0,
        };
        
        console.log('💾 Setting analytics data:', data);
        setAnalyticsData(data);
      } catch (err) {
        console.error('❌ Analytics fetch error:', err);
        setAnalyticsData({
          views: 0,
          users: 0,
          sessions: 0,
          events: 0,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [dateRange.startDate, dateRange.endDate]);

  const handleDateRangeChange = ({ startDate, endDate }) => {
    console.log('🗓️ DateRangePicker onChange called:', { startDate, endDate });
    setDateRange({ startDate, endDate });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading analytics...
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-red-500">
        Failed to load analytics data
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      <Navbar handleLogout={handleLogout} />
      <div className="flex flex-1 w-full pt-15">
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} />
        </div>

        <div className="flex-1 max-w-7xl mx-auto p-4 flex flex-col items-center justify-center">
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 mt-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">Web Analytics</h1>
            
            {/* Date Range Selector - matching pricing quotations pattern */}
            <DateRangePicker
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
              onDateChange={handleDateRangeChange}
              className="min-w-[220px]"
            />
          </div>
          <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 mt-2">
            <div className="text-center">
              <p className="text-gray-600 font-medium">
                {dateRange.startDate && dateRange.endDate 
                  ? `Selected: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                  : 'No date range selected'
                }
              </p>
            </div>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
            {/* Total Views */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
              <div className="relative z-10">
                <span className="text-3xl font-bold text-white mb-2 block">
                  {analyticsData.views.toLocaleString()}
                </span>
                <span className="text-blue-100 font-medium">Total Views</span>
              </div>
              <div className="absolute top-4 right-4">
                <FaEye className="w-8 h-8 text-white opacity-80" />
              </div>
            </div>

            {/* Total Users */}
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
              <div className="relative z-10">
                <span className="text-3xl font-bold text-white mb-2 block">
                  {analyticsData.users.toLocaleString()}
                </span>
                <span className="text-emerald-100 font-medium">Total Users</span>
              </div>
              <div className="absolute top-4 right-4">
                <FaUsers className="w-8 h-8 text-white opacity-80" />
              </div>
            </div>

            {/* Total Sessions */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-violet-700 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
              <div className="relative z-10">
                <span className="text-3xl font-bold text-white mb-2 block">
                  {analyticsData.sessions.toLocaleString()}
                </span>
                <span className="text-purple-100 font-medium">Total Sessions</span>
              </div>
              <div className="absolute top-4 right-4">
                <FaChartLine className="w-8 h-8 text-white opacity-80" />
              </div>
            </div>

            {/* Total Events */}
            <div className="relative overflow-hidden bg-gradient-to-br from-red-400 via-red-500 to-pink-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
              <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
              <div className="relative z-10">
                <span className="text-3xl font-bold text-white mb-2 block">
                  {analyticsData.events.toLocaleString()}
                </span>
                <span className="text-red-100 font-medium">Total Events</span>
              </div>
              <div className="absolute top-4 right-4">
                <FaArrowDown className="w-8 h-8 text-white opacity-80" />
              </div>
            </div>
          </div>

          {/* Additional 2 Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 w-full">
            <UserActivityChart dateRange={dateRange} />
            <EventSummaryCard dateRange={dateRange} />
          </div>

          <div className="w-full flex flex-col items-center">
            <Analytics dateRange={dateRange} />
          </div>
        </div>
      </div>
    </div>
  );
}
