// src/components/analytics/acquisition/DataTable.jsx
import React from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';

import Pagination from './Pagination';

export default function DataTable({ tableData, searchTerm, setSearchTerm, currentPage, rowsPerPage, totalRows, setCurrentPage }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
       
      </div>

      <div className="overflow-x-auto h-96 overflow-y-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">
                <input type="checkbox" className="rounded" />
              </th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">First user prim...Channel Group ↓</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Total users</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">New users</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Returning users</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Avg engagement time</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Engaged sessions</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Event count</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Key events</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">User key event rate</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4"><input type="checkbox" className="rounded" /></td>
                <td className="py-3 px-4 font-medium text-gray-900">{row.channel}</td>
                <td className="py-3 px-4">{row.totalUsers.toLocaleString()} ({row.percentage})</td>
                <td className="py-3 px-4">{row.newUsers.toLocaleString()} ({row.percentage})</td>
                <td className="py-3 px-4">{row.returningUsers.toLocaleString()} ({row.percentage})</td>
                <td className="py-3 px-4">{row.avgEngagementTime}</td>
                <td className="py-3 px-4">{row.engagedSessions}</td>
                <td className="py-3 px-4">{row.eventCount.toLocaleString()}</td>
                <td className="py-3 px-4">{row.keyEvents}</td>
                <td className="py-3 px-4">{row.userKeyEventRate}</td>
              </tr>
            ))}
          </tbody>
            <tfoot>
              <tr>
                <td colSpan="10">
                  <Pagination
                    currentPage={currentPage}
                    rowsPerPage={rowsPerPage}
                    totalRows={totalRows}
                    setCurrentPage={setCurrentPage}
                  />
                </td>
              </tr>
            </tfoot>
        </table>
      </div>
    </div>
  );
}
