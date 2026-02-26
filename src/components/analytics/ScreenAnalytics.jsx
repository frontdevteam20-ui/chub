import React, { useState, useEffect } from 'react';

/**
 * ScreenAnalytics component that displays page analytics data
 * Fetches data from API and displays in a table format with visualizations
 */

// Helper function to format date as YYYY-MM-DD without timezone issues
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ScreenAnalytics({ startDate, endDate }) {
  const [pageData, setPageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        let url = 'https://chub-j3ha.onrender.com/api/analytics/page-title-analytics';
        if (startDate && endDate) {
          const params = new URLSearchParams({
            startDate: formatDate(startDate),
            endDate: formatDate(endDate),
          });
          url += `?${params.toString()}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch page analytics data');
        }
        const data = await response.json();
        setPageData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching page analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPageData();
  }, [startDate, endDate]);

  // Helper function to format bounce rate as percentage
  const formatBounceRate = (rate) => {
    return `${(rate * 100).toFixed(1)}%`;
  };

  // Helper function to truncate long page titles
  const truncateTitle = (title, maxLength = 60) => {
    return title.length > maxLength ? `${title.substring(0, maxLength)}...` : title;
  };

  // Helper function to get max values for bar chart scaling
  const getMaxValues = () => {
    if (!pageData.length) return { views: 0, activeUsers: 0, eventCount: 0, bounceRate: 0 };
    return {
      views: Math.max(...pageData.map(p => p.views)),
      activeUsers: Math.max(...pageData.map(p => p.activeUsers)),
      eventCount: Math.max(...pageData.map(p => p.eventCount)),
      bounceRate: Math.max(...pageData.map(p => p.bounceRate))
    };
  };

  const maxValues = getMaxValues();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // You can adjust this as needed
  const totalPages = Math.ceil(pageData.length / itemsPerPage);

  // Get data for current page
  const paginatedData = pageData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Pagination controls handler
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 w-full  mx-auto h-[700px] flex flex-col">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-200 rounded-lg w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="grid grid-cols-5 gap-4 mb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="grid grid-cols-5 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-red-200 p-6 w-full max-w-6xl mx-auto h-[700px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-red-800 mb-2">Unable to Load Page Analytics</h3>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl border border-gray-100 p-8 w-full mx-auto h-[700px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Top Pages & Screens</h2>
          </div>
        </div>
       
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Pages */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white mb-2 block">
              {pageData.length.toLocaleString()}
            </span>
            <span className="text-blue-100 font-medium">Total Pages</span>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        {/* Total Views */}
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white mb-2 block">
              {pageData.reduce((sum, page) => sum + (page.views || 0), 0).toLocaleString()}
            </span>
            <span className="text-emerald-100 font-medium">Total Views</span>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        {/* Active Users */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 via-purple-600 to-violet-700 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white mb-2 block">
              {pageData.reduce((sum, page) => sum + (page.activeUsers || 0), 0).toLocaleString()}
            </span>
            <span className="text-purple-100 font-medium">Active Users</span>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="relative overflow-hidden bg-gradient-to-br from-red-400 via-red-500 to-pink-600 rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300">
          <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
          <div className="relative z-10">
            <span className="text-3xl font-bold text-white mb-2 block">
              {pageData.length > 0 ? ((pageData.reduce((sum, page) => sum + (page.bounceRate || 0), 0) / pageData.length).toFixed(1) + '%') : '0%'}
            </span>
            <span className="text-red-100 font-medium">Bounce Rate</span>
          </div>
          <div className="absolute top-4 right-4">
            <svg className="w-8 h-8 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mb-6">
        <div className="bg-white rounded-lg px-4 py-2 border border-gray-100 shadow-sm">
          <span className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{(currentPage - 1) * itemsPerPage + 1}</span>
            -<span className="font-semibold text-blue-600">{Math.min(currentPage * itemsPerPage, pageData.length)}</span> of <span className="font-semibold text-blue-600">{pageData.length}</span> entries
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-100 shadow-sm">
          {/* Prev Arrow */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous"
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === 1 ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-sm'} transition-all duration-200`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* First page */}
          <button
            onClick={() => goToPage(1)}
            className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold text-sm ${currentPage === 1 ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md' : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600'} transition-all duration-200`}
          >
            1
          </button>

          {/* Second page, only if totalPages > 2 */}
          {totalPages > 2 && (
            <button
              onClick={() => goToPage(2)}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${currentPage === 2 ? 'bg-[#05a7cc] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#05a7cc]/10'} transition`}
            >
              2
            </button>
          )}

          {/* Ellipsis if needed before currentPage */}
          {currentPage > 4 && totalPages > 5 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
          )}

          {/* Pages near current (3, 4, ... n-2) */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page =>
              page !== 1 &&
              page !== 2 &&
              page !== totalPages &&
              (
                (currentPage <= 4 && page <= 4) ||
                (currentPage >= totalPages - 3 && page >= totalPages - 3) ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
            )
            .map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${currentPage === page ? 'bg-[#05a7cc] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#05a7cc]/10'} transition`}
              >
                {page}
              </button>
            ))}

          {/* Ellipsis if needed before last page */}
          {currentPage < totalPages - 3 && totalPages > 5 && (
            <span className="w-9 h-9 flex items-center justify-center text-gray-400">...</span>
          )}

          {/* Last page, if more than 1 */}
          {totalPages > 1 && (
            <button
              onClick={() => goToPage(totalPages)}
              className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold ${currentPage === totalPages ? 'bg-[#05a7cc] text-white' : 'bg-gray-100 text-gray-700 hover:bg-[#05a7cc]/10'} transition`}
            >
              {totalPages}
            </button>
          )}

          {/* Next Arrow */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Next"
            className={`w-9 h-9 flex items-center justify-center rounded-full ${currentPage === totalPages ? 'bg-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-500 hover:bg-gray-200'} transition`}
          >
            <span className="text-xl">&#62;</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50 rounded-xl p-4">
        {/* Showing count */}
        <div className="mb-2 text-xs text-gray-500 text-right">
          Showing {paginatedData.length} of {pageData.length} total pages
        </div>
        {/* Table */}
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-700 border-b">
                <th className="text-left px-4 py-2 font-semibold">Page title and screen class</th>
                <th className="text-left px-4 py-2 font-semibold">Bounce rate</th>
                <th className="text-right px-4 py-2 font-semibold">Views</th>
                <th className="text-right px-4 py-2 font-semibold">Active users</th>
                <th className="text-right px-4 py-2 font-semibold">Views per active user</th>
                <th className="text-right px-4 py-2 font-semibold">Avg engagement time</th>
                <th className="text-right px-4 py-2 font-semibold">Event count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedData.map((page, index) => (
                <tr key={index + (currentPage - 1) * itemsPerPage} className="hover:bg-gray-50 transition">
                  {/* Page title */}
                  <td className="px-4 py-3 text-gray-900 font-medium whitespace-nowrap">{truncateTitle(page.pageTitle)}</td>
                  {/* Bounce rate */}
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{page.bounceRateFormatted || '—'}</td>
                  {/* Views */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-900">{page.views?.toLocaleString()}</span>
                    {page.viewsPct && (
                      <span className="text-xs text-gray-500 ml-1">({page.viewsPct})</span>
                    )}
                  </td>
                  {/* Active Users */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-900">{page.activeUsers?.toLocaleString()}</span>
                    {page.activePct && (
                      <span className="text-xs text-gray-500 ml-1">({page.activePct})</span>
                    )}
                  </td>
                  {/* Views per active user */}
                  <td className="px-4 py-3 text-right">{page.viewsPerActiveUser || '—'}</td>
                  {/* Avg engagement time */}
                  <td className="px-4 py-3 text-right">{page.avgEngagementTimePerUser ?? '—'}</td>
                  {/* Event count */}
                  <td className="px-4 py-3 text-right">
                    <span className="font-semibold text-gray-900">{page.eventCount?.toLocaleString()}</span>
                    {page.eventPct && (
                      <span className="text-xs text-gray-500 ml-1">({page.eventPct})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* All old grid-based row/cell code removed. Only the <table> implementation remains. */}

       
      </div>
    </div>
  );
}