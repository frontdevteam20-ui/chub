import React from "react";
import { formatDateTime } from "./utils";

const FormsMobileCards = ({ forms, loading, visibleUid, setVisibleUid }) => {
  if (loading) {
    return <div className="text-center text-gray-500 py-8">Loading forms...</div>;
  }
  if (forms.length === 0) {
    return <div className="text-center text-gray-500 py-8">No forms found.</div>;
  }
  return (
    <div className="block sm:hidden space-y-4">
      {forms.map(form => (
        <div key={form.id} className="bg-white rounded-xl shadow p-4 flex flex-col space-y-2 border border-gray-100">
          <div className="flex items-center mb-2">
            <span className="font-bold text-lg text-gray-800">{form.companyName}</span>
            <span className="ml-auto text-xs text-cyan-700 font-mono">{form.subject}</span>
          </div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Name:</span> <span className="ml-1">{form.name}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Email:</span> <span className="ml-1">{form.email}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Phone:</span> <span className="ml-1">{form.phone}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Message:</span> <span className="ml-1">{form.message}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Timestamp:</span> <span className="ml-1">{formatDateTime(form.timestamp)}</span></div>
          <div className="flex items-center text-gray-700"><span className="font-medium">Form ID:</span>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormsMobileCards; 