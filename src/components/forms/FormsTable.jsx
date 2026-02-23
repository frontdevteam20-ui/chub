import React from "react";
import { FaEnvelope, FaPhone, FaRegCommentDots, FaCalendarAlt, FaIdBadge } from 'react-icons/fa';
import { formatDateTime } from "./utils";

const FormsTable = ({ forms, loading, visibleUid, setVisibleUid }) => {
  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading forms...</div>;
  }
  if (forms.length === 0) {
    return <div className="text-center text-gray-500 py-8">No forms found.</div>;
  }
  return (
    <div className="overflow-x-auto w-full hidden sm:block">
      <table className="min-w-[900px] w-full divide-y divide-gray-200 text-sm sm:text-base">
        <thead>
          <tr className="bg-gradient-to-r from-cyan-100 via-white to-blue-100 rounded-t-xl shadow-sm">
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tl-xl">Company Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Name</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaEnvelope className="inline mr-1 text-cyan-400" />Email</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaPhone className="inline mr-1 text-pink-400" />Phone</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaRegCommentDots className="inline mr-1 text-blue-400" />Message</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Subject</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaCalendarAlt className="inline mr-1 text-gray-400" />Timestamp</th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tr-xl"><FaIdBadge className="inline mr-1 text-gray-400" />Form ID</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {forms.map(form => (
            <tr key={form.id} className="transition hover:bg-cyan-50 hover:shadow rounded-xl">
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle font-semibold text-gray-800">{form.companyName}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{form.name}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{form.email}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{form.phone}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{form.message}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{form.subject}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{formatDateTime(form.timestamp)}</td>
              <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle flex items-center">
                {visibleUid === form.id ? (
                  <span
                    className="ml-1 font-mono text-xs cursor-pointer px-2 py-1 border border-cyan-200 rounded-full bg-cyan-50 text-cyan-800 hover:bg-white hover:border-cyan-400 transition"
                    onClick={() => setVisibleUid(null)}
                    title="Hide Form ID"
                  >
                    {form.id}
                  </span>
                ) : (
                  <button
                    className="ml-1 px-2 py-1 border border-cyan-400 text-cyan-700 bg-white rounded-full text-xs font-semibold shadow-sm hover:bg-cyan-50 hover:border-cyan-600 hover:text-cyan-900 transition focus:outline-none focus:ring-2 focus:ring-cyan-300"
                    onClick={() => setVisibleUid(form.id)}
                  >
                    View ID
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormsTable; 