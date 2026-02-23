import React from 'react';
import StatusBadge from './StatusBadge';

export default function LeadsMobileCards({ leads, visibleUid, setVisibleUid, formatDateTime }) {
  return (
    <div className="block sm:hidden space-y-4">
      {leads.map(lead => (
        <div key={lead.id} className="bg-white rounded-xl shadow p-4 flex flex-col space-y-2 border border-gray-100">
          <div className="flex items-center mb-2">
            <span className="font-bold text-lg text-gray-800">{lead.companyName}</span>
            <span className="ml-auto"><StatusBadge status={lead.status} /></span>
          </div>
          <div className="flex items-center text-gray-700"><span className="font-medium">First Name:</span> <span className="ml-1">{lead.firstName}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Industry:</span> <span className="ml-1">{lead.industry}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Message:</span> <span className="ml-1">{lead.message}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Phone:</span> <span className="ml-1">{lead.phoneNumber}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Created:</span> <span className="ml-1">{formatDateTime(lead.createdAt)}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Updated:</span> <span className="ml-1">{formatDateTime(lead.updatedAt)}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Email:</span> <span className="ml-1">{lead.userEmail}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">User ID:</span>
            {visibleUid === lead.id ? (
              <span
                className="ml-1 font-mono text-xs cursor-pointer px-2 py-1 border border-emerald-200 rounded-full bg-emerald-50 text-emerald-800 hover:bg-white hover:border-emerald-400 transition"
                onClick={() => setVisibleUid(null)}
                title="Hide UID"
              >
                {lead.userId}
              </span>
            ) : (
              <button
                className="ml-1 px-2 py-1 border border-emerald-400 text-emerald-700 bg-white rounded-full text-xs font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
                onClick={() => setVisibleUid(lead.id)}
              >
                View UID
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 