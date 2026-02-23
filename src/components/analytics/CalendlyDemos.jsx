import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiCalendar, FiClock, FiUser, FiXCircle, FiCheckCircle, FiClock as FiClockOutline, FiMapPin, FiUserX } from 'react-icons/fi';
import Navbar from '../Navbar';
import HamburgerMenu from '../HamburgerMenu';
import DemoDetailsModal from './DemoDetailsModal';
import DemoFilterSortBar from './DemoFilterSortBar';
import { fetchCalendlyEvents, fetchEventInvitees, clearError, forceRefresh } from '../../store/calendlySlice';

export default function CalendlyDemos({ handleLogout, user }) {
  const dispatch = useDispatch();
  const { events, invitees, loading, error, lastFetched, loadingInvitee } = useSelector(state => state.calendly);
  
  const [modalEvent, setModalEvent] = useState(null);
  const [invitee, setInvitee] = useState(null);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('all'); // all, completed, upcoming, canceled, not_joined
  const [sortOrder, setSortOrder] = useState('desc'); // desc = newest first, asc = oldest first
  const pageSize = 10;

  // Cache duration: 2 minutes (reduced for more frequent updates)
  const CACHE_DURATION = 2 * 60 * 1000;

  useEffect(() => {
    // Check if we need to fetch data
    const shouldFetch = !lastFetched || (Date.now() - lastFetched > CACHE_DURATION);
    
    if (shouldFetch && !loading) {
      dispatch(fetchCalendlyEvents());
    }
  }, [dispatch, lastFetched, loading]);

  // Auto-refresh when component becomes visible (for newly scheduled demos)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastFetched) {
        const timeSinceLastFetch = Date.now() - lastFetched;
        if (timeSinceLastFetch > CACHE_DURATION) {
          dispatch(fetchCalendlyEvents());
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch, lastFetched, CACHE_DURATION]);

  // Add manual refresh capability
  const handleRefresh = () => {
    dispatch(fetchCalendlyEvents());
  };

  // Add calculated status to events from Redux data
  const eventsWithStatus = events.map(event => {
    const list = invitees[event.uri] || [];
    const eventEnded = new Date(event.end_time) <= new Date();
    const isCanceled = event.status === 'canceled';
    const anyAttended = list.some(inv => inv.participation_status === 'attended');
    const allInviteesFlaggedNoShow = list.length > 0 && list.every(inv => inv && inv.no_show != null);

    let calculatedStatus = 'unknown';
    if (isCanceled) calculatedStatus = 'canceled';
    else if (!eventEnded) calculatedStatus = 'upcoming';
    else if (anyAttended) calculatedStatus = 'completed';
    else if (allInviteesFlaggedNoShow) calculatedStatus = 'no_show';
    else calculatedStatus = 'completed'; // fallback for ended events without explicit flags

    return { ...event, _calculatedStatus: calculatedStatus };
  });

  // Process events for stats/filters
  const completed = eventsWithStatus.filter(e => e._calculatedStatus === 'completed');
  const upcoming = eventsWithStatus.filter(e => e._calculatedStatus === 'upcoming');
  const canceled = eventsWithStatus.filter(e => e._calculatedStatus === 'canceled');
  const notJoined = eventsWithStatus.filter(e => e._calculatedStatus === 'no_show');

  // Filter events
  let filteredEvents = eventsWithStatus;
  if (filter === 'completed') filteredEvents = completed;
  else if (filter === 'upcoming') filteredEvents = upcoming;
  else if (filter === 'canceled') filteredEvents = canceled;
  else if (filter === 'not_joined') filteredEvents = notJoined;

  // Sort events
  filteredEvents = [...filteredEvents].sort((a, b) => {
    const aTime = new Date(a.start_time);
    const bTime = new Date(b.start_time);
    return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize);

  // Reset page when filter or sort changes
  useEffect(() => {
    setPage(1);
  }, [filter, sortOrder]);

  // Modal logic
  const handleViewDetails = (event) => {
    setModalEvent(event);
    setInvitee(null);
    const eventUuid = event.uri.split('/').pop();
    
    // Dispatch the Redux action to fetch invitees
    dispatch(fetchEventInvitees(eventUuid)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        // Find the invitee in the Redux store
        const inviteeList = invitees[event.uri] || [];
        setInvitee(inviteeList[0] || null);
      }
    }).catch((error) => {
      console.error('Error fetching invitee:', error);
      setInvitee(null);
    });
  };

  const handleCloseModal = () => {
    setModalEvent(null);
    setInvitee(null);
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  // Helper for badge: prefer _calculatedStatus when present
  const statusToBadge = (ev) => {
    const fallback = ev.status === 'canceled'
      ? 'canceled'
      : (new Date(ev.start_time) > new Date() ? 'upcoming' : 'completed');

    return ev._calculatedStatus || fallback;
  };

  const badgeClass = (s) =>
    s === 'canceled'
      ? 'bg-red-100 text-red-800'
      : s === 'upcoming'
        ? 'bg-blue-100 text-blue-800'
        : s === 'completed'
          ? 'bg-green-100 text-green-800'
          : s === 'no_show'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-gray-100 text-gray-800';

  const badgeText = (s) =>
    s === 'canceled' ? 'Cancelled'
      : s === 'upcoming' ? 'Upcoming'
      : s === 'completed' ? 'Completed'
      : s === 'no_show' ? 'Not Joined'
      : 'Unknown';

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:ml-64">
      {/* Navbar */}
      <Navbar handleLogout={handleLogout} />
      
      {/* Refresh Button */}
      <div className="fixed top-20 right-4 z-50">
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full pt-20">
        {/* Sidebar / Hamburger */}
        <div className="sm:block">
          <HamburgerMenu handleLogout={handleLogout} user={user} />
        </div>

        {/* Page Content */}
        <div className="flex-1 max-w-6xl mx-auto p-4">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Demo Schedule</h1>
              <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                <DemoFilterSortBar
                  filter={filter}
                  sortOrder={sortOrder}
                  onFilterChange={setFilter}
                  onSortOrderChange={setSortOrder}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">

              {/* Total Demos Card */}
              <div 
                onClick={() => setFilter('all')}
                className={`relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl shadow-xl p-4 sm:p-5 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${filter === 'all' ? 'ring-2 ring-offset-2 ring-blue-400' : ''}`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-bold text-white block">{events.length}</span>
                  <span className="text-blue-100 font-medium">Total Demos</span>
                </div>
                <div className="absolute top-4 right-4">
                  <FiCalendar className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Not Joined Card */}
              <div 
                onClick={() => setFilter('not_joined')}
                className={`relative overflow-hidden bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 rounded-xl shadow-xl p-4 sm:p-5 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${filter === 'not_joined' ? 'ring-2 ring-offset-2 ring-amber-400' : ''}`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-bold text-white block">{notJoined.length}</span>
                  <span className="text-amber-100 font-medium">Not Joined</span>
                </div>
                <div className="absolute top-4 right-4">
                  <FiUserX className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Upcoming Card */}
              <div 
                onClick={() => setFilter('upcoming')}
                className={`relative overflow-hidden bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 rounded-xl shadow-xl p-4 sm:p-5 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${filter === 'upcoming' ? 'ring-2 ring-offset-2 ring-emerald-400' : ''}`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-bold text-white block">{upcoming.length}</span>
                  <span className="text-emerald-100 font-medium">Upcoming</span>
                </div>
                <div className="absolute top-4 right-4">
                  <FiClockOutline className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Completed Card */}
              <div 
                onClick={() => setFilter('completed')}
                className={`relative overflow-hidden bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 rounded-xl shadow-xl p-4 sm:p-5 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${filter === 'completed' ? 'ring-2 ring-offset-2 ring-cyan-400' : ''}`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-bold text-white block">{completed.length}</span>
                  <span className="text-cyan-100 font-medium">Completed</span>
                </div>
                <div className="absolute top-4 right-4">
                  <FiCheckCircle className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>

              {/* Canceled Card */}
              <div 
                onClick={() => setFilter('canceled')}
                className={`relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-pink-700 rounded-xl shadow-xl p-4 sm:p-5 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer ${filter === 'canceled' ? 'ring-2 ring-offset-2 ring-red-400' : ''}`}
              >
                <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
                <div className="relative z-10 text-center">
                  <span className="text-3xl font-bold text-white block">{canceled.length}</span>
                  <span className="text-red-100 font-medium">Cancelled</span>
                </div>
                <div className="absolute top-4 right-4">
                  <FiXCircle className="w-8 h-8 text-white opacity-80" />
                </div>
              </div>
            </div>

          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedEvents.map(ev => {
                    const eventDate = new Date(ev.start_time);
                    const duration = Math.round((new Date(ev.end_time) - new Date(ev.start_time)) / 60000);
                    const hostName = ev.event_memberships?.[0]?.user_name || 'Host';

                    // Invitees for display
                    const list = invitees[ev.uri] || [];
                    const primaryInvitee = list[0];

                    const st = statusToBadge(ev);

                    return (
                      <div key={ev.uri} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                              {primaryInvitee?.name || (list.length ? `${list.length} Attendees` : 'No Invitee')}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${badgeClass(st)}`}
                            >
                              {badgeText(st)}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600 flex-1">
                            <div className="flex items-start">
                              <FiUser className="mt-0.5 mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                              <span className="truncate">Host: {hostName}</span>
                            </div>
                            <div className="flex items-start">
                              <FiCalendar className="mt-0.5 mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                              <div>
                                <div>{eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                                <div className="text-gray-500 text-sm">
                                  {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {' • '}
                                  {duration} min
                                </div>
                              </div>
                            </div>
                            {ev.location && (
                              <div className="flex items-start">
                                <FiMapPin className="mt-0.5 mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                                <span className="truncate">{ev.location.type === 'physical' ? ev.location.location : 'Virtual Meeting'}</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleViewDetails(ev)}
                            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredEvents.length === 0 && (
                    <div className="col-span-full py-10 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        {filter === 'completed' && 'No completed demos found'}
                        {filter === 'upcoming' && 'No upcoming demos found'}
                        {filter === 'canceled' && 'No canceled demos found'}
                        {filter === 'all' && 'No demos found'}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {filter === 'upcoming' && 'Check back later for scheduled demos.'}
                        {filter !== 'upcoming' && 'Try adjusting your filter criteria.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 mb-10 w-full flex justify-center px-4 sm:px-0">
                    <nav className="inline-flex items-center rounded-md shadow-sm" aria-label="Pagination">
                      <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`relative inline-flex items-center border-t border-b px-4 py-2 text-sm font-medium ${
                            page === pageNum
                              ? 'z-10 border-blue-500 bg-blue-50 text-blue-600'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </div>

              <DemoDetailsModal event={modalEvent} onClose={handleCloseModal} invitee={invitee} loadingInvitee={loadingInvitee} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
