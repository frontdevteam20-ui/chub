import React, { useState, useEffect } from 'react';

/**
 * Beautiful EventSummaryCard with modern UI design.
 * Fetches data dynamically from API and displays with pagination.
 */
export default function EventSummaryCard({ dateRange }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 8;

  // Generate sparkline data based on event counts
  const generateSparklineData = (eventData) => {
    if (!eventData.length) return [];
    const maxCount = Math.max(...eventData.map(e => e.eventCount));
    return eventData.slice(0, 14).map(e => Math.ceil((e.eventCount / maxCount) * 4));
  };

  const fetchEventData = async () => {
    try {
      setLoading(true);
      // Build query params if dateRange is provided
      let url = 'https://chub-j3ha.onrender.com/api/analytics/event-count-by-name';
      if (dateRange && dateRange.startDate && dateRange.endDate) {
        const params = new URLSearchParams({
          startDate: dateRange.startDate.toISOString().split('T')[0],
          endDate: dateRange.endDate.toISOString().split('T')[0],
        });
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch event data');
      }
      const data = await response.json();
      
      console.log(' EventSummaryCard API Response:', data);
      console.log(' EventSummaryCard API URL:', url);
      console.log(' EventSummaryCard Date Range:', dateRange);
      
      // Handle different response structures
      let processedData = [];
      if (Array.isArray(data)) {
        processedData = data.map(item => ({
          eventName: item.eventName || item.name || 'Unknown',
          eventCount: item.eventCount || item.count || 0
        }));
      } else if (data && typeof data === 'object') {
        // Handle object response
        processedData = Object.entries(data).map(([key, value]) => ({
          eventName: key || 'Unknown',
          eventCount: typeof value === 'number' ? value : parseInt(value) || 0
        }));
      }
      
      console.log(' Processed EventSummaryCard data:', processedData);
      setEvents(processedData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching event data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [dateRange.startDate, dateRange.endDate]);

  // Calculate pagination
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  // Calculate stats for top event
  const topEvent = events[0];
  const totalEvents = events.reduce((sum, event) => sum + event.eventCount, 0);
  const topEventPercent = topEvent ? (topEvent.eventCount / totalEvents) * 100 : 0;
  const sparklineData = generateSparklineData(events);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-4xl mx-auto backdrop-blur-sm">
        <div className="animate-pulse">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mr-3"></div>
            <div className="h-6 bg-gray-200 rounded-lg w-1/3"></div>
          </div>
          <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-12 rounded-xl mb-6"></div>
          <div className="space-y-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-100 rounded-xl">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl shadow-xl border border-red-200 p-8 w-full max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Data</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-4xl mx-auto backdrop-blur-sm relative overflow-hidden h-[600px] flex flex-col">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-12 translate-x-12 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-full translate-y-10 -translate-x-10 opacity-20"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Event Analytics
            </h2>
            <p className="text-sm text-gray-500 font-medium">Event Count by Name</p>
            <p className="text-sm text-gray-500 font-medium">
              {dateRange.startDate && dateRange.endDate 
                ? `Date Range: ${dateRange.startDate.toLocaleDateString()} - ${dateRange.endDate.toLocaleDateString()}`
                : 'No date range selected'
              }
            </p>
          </div>
        </div>
       
      </div>

    
      {/* Table Section */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-lg flex-1 flex flex-col min-h-0">
        {/* Table header */}
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-base font-semibold text-gray-800">All Events</h3>
          <div className="text-xs text-gray-500">
            Total: {events.length} events
          </div>
        </div>

        <div className="flex font-bold text-xs text-black-600 mb-2 px-3 flex-shrink-0 text-left">
          <div className="flex-1">Event Name</div>
          <div className="w-32 text-right">Count</div>
        </div>

        {/* Scrollable Table rows */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400 pr-2">
          <div className="space-y-1">
            {events.map((event, idx) => {
              const eventPercent = (event.eventCount / totalEvents) * 100;
              return (
                <div
                  key={event.eventName}
                  className="flex items-center p-3 rounded-lg bg-white/70 hover:bg-white/90 transition-all duration-200 hover:shadow-md group border border-gray-100/50"
                >
                  <div className="flex items-center flex-1 space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                      idx === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                      idx === 2 ? 'bg-gradient-to-r from-amber-600 to-yellow-600' :
                      'bg-gradient-to-r from-blue-400 to-blue-500'
                    } shadow-sm`}></div>
                    <span className="font-medium text-gray-800 capitalize group-hover:text-gray-900 transition-colors text-sm">
                      {event.eventName.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="w-32 text-right">
                    <span className="font-bold text-gray-900 text-base">
                      {event.eventCount.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
