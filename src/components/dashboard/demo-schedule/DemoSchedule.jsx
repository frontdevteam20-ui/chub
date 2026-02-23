import React, { useState } from 'react';
import { FaCalendarAlt, FaVideo, FaUsers, FaCheckCircle, FaClock, FaMapPin, FaExternalLinkAlt } from 'react-icons/fa';
import { format } from 'date-fns';
import clsx from 'clsx';

const DemoItem = ({ demo, isUpcoming }) => {
  const demoDate = new Date(demo.date);
  const duration = demo.endTime ? Math.round((new Date(demo.endTime) - demoDate) / (1000 * 60)) : 30;
  const statusText = isUpcoming ? 'Scheduled' : 'Completed';
  const isVirtual = demo.type === 'video';

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5 h-full flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
         {/* Client and time */}
         <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {demo.client || 'New Demo'}
        </h3>
        {/* Header with status */}
        <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500">
            {format(demoDate, 'MMM d, yyyy')}
          </span>
         
          <div className="flex items-center text-sm text-gray-600 ">
          <FaClock className="mr-2 text-gray-400 flex-shrink-0" />
          <span>
            {format(demoDate, 'h:mm a')} • {duration} min
          </span>
        </div>
        
        <span className={clsx(
            "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
            isUpcoming 
              ? "bg-blue-50 text-blue-700" 
              : "bg-green-50 text-green-700"
          )}>
            {statusText}
          </span>
        </div>

       
        
       

        {/* Meeting type */}
     

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
        <div className={clsx(
          "inline-flex items-center px-4 py-2 rounded-md text-sm",
          isVirtual 
            ? "bg-purple-50 text-purple-700" 
            : "bg-amber-50 text-amber-700"
        )}>
          {isVirtual ? (
            <>
              <FaVideo className="mr-2" />
              <span>Virtual Meeting</span>
            </>
          ) : (
            <>
              <FaMapPin className="mr-2" />
              <span>In-Person Meeting</span>
            </>
          )}
        </div>
          <div className="flex items-center text-sm text-gray-500">
            <FaUsers className="mr-1.5 text-gray-400" />
            <span>1 Attendee</span>
          </div>
        
          <button 
            onClick={() => window.open(demo.meetingLink || '#', '_blank')}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            View Details
            <FaExternalLinkAlt className="ml-1.5 text-xs opacity-70" />
          </button>
        </div>
      </div>
    </div>
  );
};

const DemoSchedule = ({ demos = [] }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Debug: Log all demo details
  console.log('All demo details:', demos.map(demo => ({
    id: demo.id,
    title: demo.title,
    client: demo.client,
    date: demo.date,
    formattedDate: demo.date ? new Date(demo.date).toISOString() : null,
    status: demo.status,
    type: demo.type,
    meetingLink: demo.meetingLink,
    endTime: demo.endTime,
    // Include any other properties that might be available
    ...demo  // This will include any additional properties
  })));
  
  // Separate demos into upcoming and recent, excluding cancelled ones
  const upcomingDemos = demos
    .filter(demo => {
      const demoDate = new Date(demo.date);
      return demo.status === 'upcoming' && 
             demoDate > new Date() && 
             !demo.title?.toLowerCase().includes('cancelled');
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
  // Get 7 most recent completed demos, sorted by newest first, excluding cancelled ones
  const recentDemos = demos
    .filter(demo => {
      const demoDate = new Date(demo.date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      console.log(demo);
      return demo.status === 'completed' && 
             demoDate <= new Date() && 
             demoDate >= thirtyDaysAgo &&
             !demo.status?.toLowerCase().includes('cancelled');
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);
    
  console.log('Filtered recent demos:', recentDemos.map(d => ({
    id: d.id,
    date: d.date,
    year: new Date(d.date).getFullYear(),
    month: new Date(d.date).getMonth() + 1
  })));
    
  const displayDemos = activeTab === 'upcoming' ? upcomingDemos : recentDemos;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col w-full h-[800px] overflow-hidden">
      <div className="p-6 pb-0 flex-shrink-0">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Demo Schedules</h1>
            <p className="text-sm text-gray-500 mt-1">
              {activeTab === 'upcoming' 
                ? 'Upcoming demo sessions' 
                : 'Recently completed demos'}
            </p>
          </div>
          <a 
            href="/admin/calendly-demos"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
          >
            View All
            <FaExternalLinkAlt className="ml-1.5 text-xs opacity-70" />
          </a>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 -mx-6 px-6">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'upcoming' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Upcoming ({upcomingDemos.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'recent' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            Recent ({recentDemos.length})
          </button>
        </div>
      </div>
      
      {/* Demo List */}
      <div className="flex-1 overflow-y-auto p-6 pt-4 w-full">
        {displayDemos.length > 0 ? (
          <div className={`grid gap-6 w-full pb-4 ${activeTab === 'upcoming' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {displayDemos.slice(0, 6).map((demo) => (
              <DemoItem key={demo.id} demo={demo} isUpcoming={activeTab === 'upcoming'} />
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 m-4">
            <FaCalendarAlt className="text-4xl mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-700 mb-1">
              {activeTab === 'upcoming' 
                ? 'No upcoming demos scheduled' 
                : 'No recent demos to show'}
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              {activeTab === 'upcoming' 
                ? 'Check back later for new demo sessions.'
                : 'Completed demos will appear here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoSchedule;
