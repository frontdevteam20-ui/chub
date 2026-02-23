import React from 'react';

const statusColors = {
  quoted: 'bg-blue-100 text-blue-700',
  new: 'bg-green-100 text-green-700',
  won: 'bg-emerald-100 text-emerald-700',
  lost: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-700',
};

export default function StatusBadge({ status }) {
  const color = statusColors[status?.toLowerCase()] || statusColors.default;
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>{status || '-'}</span>;
} 