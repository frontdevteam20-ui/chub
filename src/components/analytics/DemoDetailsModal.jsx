import React from 'react';
import { FiCalendar, FiClock, FiUser, FiMapPin, FiLink, FiMail, FiInfo } from 'react-icons/fi';

function formatDuration(start, end) {
  const duration = Math.round((new Date(end) - new Date(start)) / 60000);
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function DemoDetailsModal({ event, onClose, invitee, loadingInvitee }) {
  if (!event) return null;
  const formatDateTime = (dateString) => {
    const options = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const renderValue = (value, isLink = false) => {
    if (!value) return <span className="text-gray-400">Not specified</span>;
    if (isLink && (value.startsWith('http') || value.startsWith('mailto:'))) {
      return (
        <a 
          href={value} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline break-all flex items-center"
        >
          <FiLink className="mr-1 flex-shrink-0" />
          {value.replace(/^https?:\/\//, '').split('/')[0]}
        </a>
      );
    }
    return value;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Scheduled' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' }
    };
    const statusInfo = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" style={{ minHeight: '500px' }}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className='flex items-center'>
          
          <FiCalendar className="mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-900">
            
              {event.event_type_name || 'Meeting Details'} 
              {/* {getStatusBadge(event.status)} */}
            </h2>
            
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
            aria-label="Close"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Meeting Info Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-start">
                  <FiClock className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                  <div className='flex flex-col items-start'>
                    <p className="text-sm text-gray-500">Date & Time</p>
                    <p className="font-medium">{formatDateTime(event.start_time)}</p>
                    <p className="text-sm text-gray-500">
                      Duration: {formatDuration(event.start_time, event.end_time)}
                    </p>
                  </div>
                </div>
                
                {event.location && (
                  <div className="flex items-start">
                    <FiLink className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    <div className='flex flex-col items-start'>
                      <p className="text-sm text-gray-500">Meeting Link</p>
                      <p className="font-medium">
                        {event.location.type === 'physical' 
                          ? event.location.location 
                          : renderValue(event.location.join_url, true)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start">
                  <FiUser className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 text-left">Host</p>
                    <p className="font-medium">
                      {event.event_memberships?.[0]?.user_name || event.organizer_email || 'N/A'}
                    </p>
                  </div>
                </div>
                
                {invitee && (
                  <div className="flex items-start">
                    <FiMail className="mt-0.5 mr-2 text-gray-500 flex-shrink-0" />
                    <div className='flex flex-col items-start'>
                      <p className="text-sm text-gray-500">Invitee</p>
                      <p className="font-medium">{invitee.name || 'N/A'}</p>
                      <p className="text-sm text-gray-700">{invitee.email || ''}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Questions & Answers Section */}
          {(!loadingInvitee && invitee?.questions_and_answers?.length > 0) && (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FiInfo className="mr-2 text-blue-500" />
                  Questions & Answers
                </h3>
              </div>
              <div className="divide-y divide-gray-200">
                {invitee.questions_and_answers.map((qa, idx) => (
                  <div key={idx} className="p-4 flex flex-col items-start">
                    <p className="font-medium text-gray-900">{qa.question}</p>
                    <p className="mt-1 text-start text-gray-700 whitespace-pre-line">{qa.answer || 'No answer provided'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {loadingInvitee && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading meeting details...</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </div>
  );
}

export default DemoDetailsModal; 