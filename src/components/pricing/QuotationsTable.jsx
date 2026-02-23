import React, { useState } from "react";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../leads/utils";
import { FaIndustry, FaRegCommentDots, FaPhone, FaCalendarAlt, FaEnvelope, FaIdBadge, FaFilter } from 'react-icons/fa';

const QuotationsTable = ({ leads, loading, visibleUid, setVisibleUid, isFiltered = false }) => {
  const [openDetail, setOpenDetail] = useState({ id: null, type: null });

  const handleOpen = (id, type) => setOpenDetail({ id, type });
  const handleClose = () => setOpenDetail({ id: null, type: null });

  // Helper to format date as dd/mm/yyyy and time as HH:mm (24-hour)
  function formatDateAndTime(val) {
    if (!val) return { date: '-', time: '-' };
    let dateObj;
    if (typeof val === 'object' && val.seconds !== undefined && val.nanoseconds !== undefined && typeof val.toDate === 'function') {
      dateObj = val.toDate();
    } else if (val instanceof Date) {
      dateObj = val;
    } else {
      dateObj = new Date(val);
    }
    if (isNaN(dateObj.getTime())) return { date: '-', time: '-' };
    const dd = String(dateObj.getDate()).padStart(2, '0');
    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
    const yyyy = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return {
      date: `${dd}-${mm}-${yyyy}`,
      time: `${hours}:${minutes}:${seconds}`,
    };
  }

  const renderPopover = (content, onClose) => (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-200 animate-fadeInModal"
        onClick={onClose}
        aria-label="Close popover overlay"
      />
      {/* Modal Popup */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-2">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 border-t-4 border-blue-500 animate-fadeInModal"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            background: 'rgba(255,255,255,0.98)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
          onClick={e => e.stopPropagation()} // Prevent overlay click from closing when clicking inside
        >
          <button
            className="absolute top-3 right-4 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mt-2">{content}</div>
        </div>
      </div>
      {/* Animation styles */}
      <style>{`
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.97) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeInModal {
          animation: fadeInModal 0.22s cubic-bezier(.4,0,.2,1);
        }
      `}</style>
    </>
  );

  return (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex flex-col items-center justify-center mb-4">
      <h2 className="text-lg font-semibold text-gray-800 text-center">Step 1: Leads</h2>
      {isFiltered && (
        <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-2">
          <FaFilter className="text-xs" />
          <span>Date filtered</span>
        </div>
      )}
    </div>
    {loading ? (
      <div className="text-center text-gray-500 py-8">Loading leads...</div>
    ) : leads.length === 0 ? (
      <div className="text-center text-gray-500 py-8">
        {isFiltered ? "No leads found for the selected date range." : "No leads found."}
      </div>
    ) : (
      <>
        {/* Table for desktop/tablet */}
        <div className="overflow-x-auto w-full hidden sm:block">
          <table className="min-w-[1000px] w-full divide-y divide-gray-200 text-sm sm:text-base">
            <thead>
              <tr className="bg-gradient-to-r from-emerald-100 via-white to-blue-100 rounded-t-xl shadow-sm">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tl-xl">Company Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">First Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaIndustry className="inline mr-1 text-emerald-400" />Industry</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaRegCommentDots className="inline mr-1 text-blue-400" />Message</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaPhone className="inline mr-1 text-cyan-400" />Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaCalendarAlt className="inline mr-1 text-gray-400" />Created At</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaCalendarAlt className="inline mr-1 text-gray-400" />Updated At</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"><FaEnvelope className="inline mr-1 text-orange-400" />User Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tr-xl"><FaIdBadge className="inline mr-1 text-gray-400" />User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {leads.map(lead => (
                <tr key={lead.id} className="transition hover:bg-emerald-50 hover:shadow rounded-xl">
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle font-semibold text-gray-800">{lead.companyName}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.firstName}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.industry}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.message}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{lead.phoneNumber}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle"><StatusBadge status={lead.status} /></td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{formatDateTime(lead.createdAt)}</td>
                  <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle relative">
                    <button
                      className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                      onClick={() => handleOpen(lead.id, 'updatedAt')}
                      type="button"
                    >
                      View
                    </button>
                    {openDetail.id === lead.id && openDetail.type === 'updatedAt' && (
                      renderPopover(
                        (() => {
                          const { date, time } = formatDateAndTime(lead.updatedAt);
                          return (
                            <div>
                              <div><span className="font-semibold">Date:</span> {date}</div>
                              <div><span className="font-semibold">Time:</span> {time}</div>
                            </div>
                          );
                        })(),
                        handleClose
                      )
                    )}
                  </td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Card view for mobile */}
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
              <div className="flex items-center text-gray-700 relative">
                <span className="font-medium">Updated:</span>
                <button
                  className="ml-2 px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                  onClick={() => handleOpen(lead.id + '-mobile', 'updatedAt')}
                  type="button"
                >
                  View
                </button>
                {openDetail.id === lead.id + '-mobile' && openDetail.type === 'updatedAt' && (
                  renderPopover(
                    (() => {
                      const { date, time } = formatDateAndTime(lead.updatedAt);
                      return (
                        <div>
                          <div><span className="font-semibold">Date:</span> {date}</div>
                          <div><span className="font-semibold">Time:</span> {time}</div>
                        </div>
                      );
                    })(),
                    handleClose
                  )
                )}
              </div>
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
      </>
    )}
  </div>
  );
};

export default QuotationsTable; 