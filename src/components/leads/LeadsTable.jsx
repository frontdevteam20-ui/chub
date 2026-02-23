import React from 'react';
import StatusBadge from './StatusBadge';
import { FaIndustry, FaRegCommentDots, FaPhone, FaCalendarAlt, FaEnvelope, FaIdBadge } from 'react-icons/fa';

export default function LeadsTable({ leads, loading, visibleUid, setVisibleUid, formatDateTime }) {
  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading leads...</div>;
  }
  if (leads.length === 0) {
    return <div className="text-center text-gray-500 py-8">No leads found.</div>;
  }
  return (
    <div className="overflow-x-auto w-full hidden sm:block">
      <table className="min-w-[1000px] w-full divide-y divide-gray-200 text-sm sm:text-base">
        <thead>
          <tr className="bg-gradient-to-r from-emerald-100 via-white to-blue-100 rounded-t-xl shadow-sm">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tl-xl">Company Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">First Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaIndustry className="inline mr-1 text-emerald-400" />Industry</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Location</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaRegCommentDots className="inline mr-1 text-blue-400" />Message</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaPhone className="inline mr-1 text-cyan-400" />Phone Number</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Source</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaCalendarAlt className="inline mr-1 text-gray-400" />Created At</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaCalendarAlt className="inline mr-1 text-gray-400" />Updated At</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaEnvelope className="inline mr-1 text-orange-400" />User Email</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaIdBadge className="inline mr-1 text-gray-400" />User ID</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tr-xl">Website</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {leads.map(lead => (
            <tr key={lead.id} className="transition hover:bg-emerald-50 hover:shadow rounded-xl">
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle font-semibold text-gray-800">{lead.companyName}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.firstName}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.industry}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.location}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.message}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.phoneNumber}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.source}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle"><StatusBadge status={lead.status} /></td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{formatDateTime(lead.createdAt)}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{formatDateTime(lead.updatedAt)}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.userEmail}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle flex items-center">
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
              </td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.website}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
