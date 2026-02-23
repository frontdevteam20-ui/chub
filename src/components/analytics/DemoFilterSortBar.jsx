import React from 'react';

export default function DemoFilterSortBar({ filter, sortOrder, onFilterChange, onSortOrderChange }) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl mb-4 gap-2">
      <div className="flex gap-2">
        <button onClick={() => onFilterChange('all')} className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}>All</button>
        <button onClick={() => onFilterChange('completed')} className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Completed</button>
        <button onClick={() => onFilterChange('upcoming')} className={`px-3 py-1 rounded ${filter === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Upcoming</button>
        <button onClick={() => onFilterChange('cancelled')} className={`px-3 py-1 rounded ${filter === 'cancelled' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}>Cancelled</button>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sortOrder" className="text-sm text-gray-700">Sort by:</label>
        <select id="sortOrder" value={sortOrder} onChange={e => onSortOrderChange(e.target.value)} className="px-2 py-1 rounded border border-gray-300">
          <option value="desc">Start Time: Newest First</option>
          <option value="asc">Start Time: Oldest First</option>
        </select>
      </div>
    </div>
  );
} 