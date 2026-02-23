import React from 'react';
import StatusBadge from './StatusBadge';

export default function QuotationsMobileCards({ quotations, visibleUid, setVisibleUid, formatDateTime }) {
  return (
    <div className="block sm:hidden space-y-4">
      {quotations.map(quotation => (
        <div key={quotation.id} className="bg-white rounded-xl shadow p-4 flex flex-col space-y-2 border border-gray-100">
          <div className="flex items-center mb-2">
            <span className="font-bold text-lg text-gray-800">{quotation.companyName}</span>
            <span className="ml-auto"><StatusBadge status={quotation.status} /></span>
          </div>
          <div className="flex items-center text-gray-700"><span className="font-medium">First Name:</span> <span className="ml-1">{quotation.firstName}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Industry:</span> <span className="ml-1">{quotation.industry}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Message:</span> <span className="ml-1">{quotation.message}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Phone:</span> <span className="ml-1">{quotation.phoneNumber}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Created:</span> <span className="ml-1">{formatDateTime(quotation.createdAt)}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Updated:</span> <span className="ml-1">{formatDateTime(quotation.updatedAt)}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Email:</span> <span className="ml-1">{quotation.userEmail}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">User ID:</span>
            {visibleUid === quotation.id ? (
              <span
                className="ml-1 font-mono text-xs cursor-pointer px-2 py-1 border border-emerald-200 rounded-full bg-emerald-50 text-emerald-800 hover:bg-white hover:border-emerald-400 transition"
                onClick={() => setVisibleUid(null)}
                title="Hide UID"
              >
                {quotation.userId}
              </span>
            ) : (
              <button
                className="ml-1 px-2 py-1 border border-emerald-400 text-emerald-700 bg-white rounded-full text-xs font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
                onClick={() => setVisibleUid(quotation.id)}
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