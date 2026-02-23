import React, { useState } from "react";
import { FaDollarSign, FaRupeeSign } from "react-icons/fa";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../leads/utils";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import DateRangePicker from "./DateRangePicker";

function renderSelectedModules(selectedModules) {
  if (!selectedModules || typeof selectedModules !== 'object') return '-';
  return Object.entries(selectedModules)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

function renderTotalPrice(totalPrice) {
  if (!totalPrice || typeof totalPrice !== 'object') return '-';
  return Object.entries(totalPrice)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');
}

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

const QuotationsStep2Table = ({ quotations, loading }) => {
  const [openDetail, setOpenDetail] = useState({ id: null, type: null });
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [visibleUid, setVisibleUid] = useState(null);

  const handleOpen = (id, type) => setOpenDetail({ id, type });
  const handleClose = () => setOpenDetail({ id: null, type: null });

  // Filter quotations by submittedAt date range
  const filteredQuotations = React.useMemo(() => {
    if (!dateRange.startDate || !dateRange.endDate) return quotations;
    return quotations.filter(q => {
      if (!q.submittedAt) return false;
      const date = new Date(q.submittedAt);
      return date >= dateRange.startDate && date <= dateRange.endDate;
    });
  }, [quotations, dateRange]);

  // Export filtered quotations to Excel
  const handleExportExcel = () => {
    const data = filteredQuotations.map(q => ({
      "Company Name": q.companyName,
      "First Name": q.firstName,
      "Industry": q.industry,
      "Billing Cycle": q.billingCycle,
      "Currency": q.currency,
      "Customization Level": q.customizationLevel,
      "Selected Modules": renderSelectedModules(q.selectedModules),
      "Total Price": renderTotalPrice(q.totalPrice),
      "Status": q.status,
      "Created At": q.createdAt,
      "Updated At": q.updatedAt,
      "Submitted At": q.submittedAt,
      "User Email": q.userEmail,
      "User ID": q.userId,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Quotations");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "Quotations.xlsx");
  };

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
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <h2 className="text-lg font-semibold text-gray-800">Step 2: Quotations</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
            className="min-w-[220px]"
          />
          <button
            onClick={handleExportExcel}
            className="ml-0 sm:ml-2 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition text-sm font-semibold"
            disabled={filteredQuotations.length === 0}
          >
            Export to Excel
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 py-8">Loading quotations...</div>
      ) : filteredQuotations.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          {dateRange.startDate && dateRange.endDate
            ? "No quotations found for the selected date range."
            : "No quotations found."}
        </div>
      ) : (
        <>
          {/* Table for desktop/tablet */}
          <div className="overflow-x-auto w-full hidden sm:block">
            <table className="min-w-[1200px] w-full divide-y divide-gray-200 text-sm sm:text-base">
              <thead>
                <tr className="bg-gradient-to-r from-yellow-100 via-white to-orange-100 rounded-t-xl shadow-sm">
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tl-xl">Company Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">First Name</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Industry</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Billing Cycle</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Currency</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Custom Level</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Sel Modules</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Total Price</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Created At</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Updated At</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">Submitted At</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap">User Email</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap rounded-tr-xl">User ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredQuotations.map(q => (
                  <tr key={q.id} className="transition hover:bg-yellow-50 hover:shadow rounded-xl relative">
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle font-semibold text-gray-800">{q.companyName}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.firstName}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.industry}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.billingCycle}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.currency}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.customizationLevel}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle relative">
                      <button
                        className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={() => handleOpen(q.id, 'modules')}
                        type="button"
                      >
                        View
                      </button>
                      {openDetail.id === q.id && openDetail.type === 'modules' && (
                        renderPopover(
                          <ul className="list-disc pl-4">
                            {q.selectedModules && typeof q.selectedModules === 'object' ? (
                              Object.entries(q.selectedModules).map(([key, value]) => (
                                <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                              ))
                            ) : (
                              <li>-</li>
                            )}
                          </ul>,
                          handleClose
                        )
                      )}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle relative">
                      <button
                        className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={() => handleOpen(q.id, 'price')}
                        type="button"
                      >
                        View
                      </button>
                      {openDetail.id === q.id && openDetail.type === 'price' && (
                        renderPopover(
                          <ul className="list-disc pl-4">
                            {q.totalPrice && typeof q.totalPrice === 'object' ? (
                              Object.entries(q.totalPrice).map(([key, value]) => {
                                const currency = q.currency?.toUpperCase() || 'INR';
                                const isUSD = currency === 'USD';
                                const CurrencyIcon = isUSD ? FaDollarSign : FaRupeeSign;
                                return (
                                  <li key={key} className="flex items-center gap-2">
                                    <span className="font-semibold">{key}:</span>
                                    {key !== 'percentage' && (
                                      <CurrencyIcon className={`inline ${isUSD ? 'text-green-600' : 'text-emerald-700'}`} />
                                    )}
                                    <span>{value}</span>
                                  </li>
                                );
                              })
                            ) : (
                              <li>-</li>
                            )}
                          </ul>,
                          handleClose
                        )
                      )}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle"><StatusBadge status={q.status} /></td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">
                      {/* Created At as plain text */}
                      {(() => {
                        const { date, time } = formatDateAndTime(q.createdAt);
                        return (
                          <>
                            <div><span className="font-semibold">{date}</span></div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </>
                        );
                      })()}
                    </td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle relative">
                      <button
                        className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={() => handleOpen(q.id, 'updatedAt')}
                        type="button"
                      >
                        View
                      </button>
                      {openDetail.id === q.id && openDetail.type === 'updatedAt' && (
                        renderPopover(
                          (() => {
                            const { date, time } = formatDateAndTime(q.updatedAt);
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
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle relative">
                      <button
                        className="px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                        onClick={() => handleOpen(q.id, 'submittedAt')}
                        type="button"
                      >
                        View
                      </button>
                      {openDetail.id === q.id && openDetail.type === 'submittedAt' && (
                        renderPopover(
                          (() => {
                            const { date, time } = formatDateAndTime(q.submittedAt);
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
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle">{q.userEmail}</td>
                    <td className="px-2 py-1 sm:px-4 sm:py-2 text-left whitespace-nowrap align-middle font-mono text-xs">
                       {visibleUid === q.id ? (
                         <span
                           className="ml-1 font-mono text-xs cursor-pointer px-2 py-1 border border-emerald-200 rounded-full bg-emerald-50 text-emerald-800 hover:bg-white hover:border-emerald-400 transition"
                           onClick={() => setVisibleUid(null)}
                           title="Hide UID"
                         >
                           {q.userId}
                         </span>
                       ) : (
                         <button
                           className="ml-1 px-2 py-1 border border-emerald-400 text-emerald-700 bg-white rounded-full text-xs font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
                           onClick={() => setVisibleUid(q.id)}
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
            {filteredQuotations.map(q => (
              <div key={q.id} className="bg-white rounded-xl shadow p-4 flex flex-col space-y-2 border border-gray-100 relative">
                <div className="flex items-center mb-2">
                  <span className="font-bold text-lg text-gray-800">{q.companyName}</span>
                  <span className="ml-auto"><StatusBadge status={q.status} /></span>
                </div>
                <div className="flex items-center text-gray-700"><span className="font-medium">First Name:</span> <span className="ml-1">{q.firstName}</span></div>
                <div className="flex items-center text-gray-700"><span className="font-medium">Industry:</span> <span className="ml-1">{q.industry}</span></div>
                <div className="flex items-center text-gray-700"><span className="font-medium">Billing Cycle:</span> <span className="ml-1">{q.billingCycle}</span></div>
                <div className="flex items-center text-gray-700"><span className="font-medium">Currency:</span> <span className="ml-1">{q.currency}</span></div>
                <div className="flex items-center text-gray-700"><span className="font-medium">Customization Level:</span> <span className="ml-1">{q.customizationLevel}</span></div>
                <div className="flex items-center text-gray-700 relative">
                  <span className="font-medium">Selected Modules:</span>
                  <button
                    className="ml-2 px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => handleOpen(q.id + '-mobile', 'modules')}
                    type="button"
                  >
                    View
                  </button>
                  {openDetail.id === q.id + '-mobile' && openDetail.type === 'modules' && (
                    renderPopover(
                      <ul className="list-disc pl-4">
                        {q.selectedModules && typeof q.selectedModules === 'object' ? (
                          Object.entries(q.selectedModules).map(([key, value]) => (
                            <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                          ))
                        ) : (
                          <li>-</li>
                        )}
                      </ul>,
                      handleClose
                    )
                  )}
                </div>
                <div className="flex items-center text-gray-700 relative">
                  <span className="font-medium">Total Price:</span>
                  <button
                    className="ml-2 px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => handleOpen(q.id + '-mobile', 'price')}
                    type="button"
                  >
                    View
                  </button>
                  {openDetail.id === q.id + '-mobile' && openDetail.type === 'price' && (
                    renderPopover(
                      <ul className="list-disc pl-4">
                        {q.totalPrice && typeof q.totalPrice === 'object' ? (
                          Object.entries(q.totalPrice).map(([key, value]) => (
                            <li key={key}><span className="font-semibold">{key}:</span> {value}</li>
                          ))
                        ) : (
                          <li>-</li>
                        )}
                      </ul>,
                      handleClose
                    )
                  )}
                </div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">Created:</span>
                  <span className="ml-1">
                    {(() => {
                      const { date, time } = formatDateAndTime(q.createdAt);
                      return (
                        <>
                          <span className="font-semibold">{date}</span>
                          <span className="text-xs text-gray-500 ml-2">{time}</span>
                        </>
                      );
                    })()}
                  </span>
                </div>
                <div className="flex items-center text-gray-700 relative">
                  <span className="font-medium">Updated:</span>
                  <button
                    className="ml-2 px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => handleOpen(q.id + '-mobile', 'updatedAt')}
                    type="button"
                  >
                    View
                  </button>
                  {openDetail.id === q.id + '-mobile' && openDetail.type === 'updatedAt' && (
                    renderPopover(
                      (() => {
                        const { date, time } = formatDateAndTime(q.updatedAt);
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
                <div className="flex items-center text-gray-700 relative">
                  <span className="font-medium">Submitted:</span>
                  <button
                    className="ml-2 px-3 py-1 rounded-full border border-blue-300 bg-blue-50 text-blue-700 text-xs font-semibold shadow-sm hover:bg-blue-100 hover:border-blue-500 hover:text-blue-900 transition focus:outline-none focus:ring-2 focus:ring-blue-200"
                    onClick={() => handleOpen(q.id + '-mobile', 'submittedAt')}
                    type="button"
                  >
                    View
                  </button>
                  {openDetail.id === q.id + '-mobile' && openDetail.type === 'submittedAt' && (
                    renderPopover(
                      (() => {
                        const { date, time } = formatDateAndTime(q.submittedAt);
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
                <div className="flex items-center text-gray-700"><span className="font-medium">Email:</span> <span className="ml-1">{q.userEmail}</span></div>
                <div className="flex items-center text-gray-700">
                  <span className="font-medium">User ID:</span>
                  {visibleUid === q.id ? (
                    <span
                      className="ml-1 font-mono text-xs cursor-pointer px-2 py-1 border border-emerald-200 rounded-full bg-emerald-50 text-emerald-800 hover:bg-white hover:border-emerald-400 transition"
                      onClick={() => setVisibleUid(null)}
                      title="Hide UID"
                    >
                      {q.userId}
                    </span>
                  ) : (
                    <button
                      className="ml-1 px-2 py-1 border border-emerald-400 text-emerald-700 bg-white rounded-full text-xs font-semibold shadow-sm hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-300"
                      onClick={() => setVisibleUid(q.id)}
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

export default QuotationsStep2Table; 