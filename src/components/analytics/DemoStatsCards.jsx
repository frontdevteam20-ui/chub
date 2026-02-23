import React from 'react';

const cardConfigs = [
  {
    key: 'completed',
    bg: 'bg-green-100',
    activeBg: 'bg-green-200 ring-4 ring-green-300',
    text: 'text-green-700',
    label: 'Completed Demos',
    countKey: 'completed',
    extra: (lastCompleted) => lastCompleted && (
      <span className="text-xs text-green-900 mt-2">Last: {new Date(lastCompleted.end_time).toLocaleString()}</span>
    ),
  },
  {
    key: 'upcoming',
    bg: 'bg-blue-100',
    activeBg: 'bg-blue-200 ring-4 ring-blue-300',
    text: 'text-blue-700',
    label: 'Upcoming Demos',
    countKey: 'upcoming',
    extra: (nextUpcoming) => nextUpcoming && (
      <span className="text-xs text-blue-900 mt-2">Next: {new Date(nextUpcoming.start_time).toLocaleString()}</span>
    ),
  },
  {
    key: 'canceled',
    bg: 'bg-gray-100',
    activeBg: 'bg-gray-200 ring-4 ring-gray-300',
    text: 'text-gray-700',
    label: 'Canceled Demos',
    countKey: 'canceled',
    extra: () => null,
  },
  {
    key: 'all',
    bg: 'bg-yellow-100',
    activeBg: 'bg-yellow-200 ring-4 ring-yellow-300',
    text: 'text-yellow-700',
    label: 'Total Demos',
    countKey: 'total',
    extra: () => null,
  },
];

export default function DemoStatsCards({ completed, upcoming, canceled, total, lastCompleted, nextUpcoming, activeFilter, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 w-full max-w-4xl mb-8">
      {cardConfigs.map(card => (
        <div
          key={card.key}
          className={`rounded-xl shadow-lg p-8 flex flex-col items-center cursor-pointer transition-all duration-200 ${
            activeFilter === card.key ? card.activeBg : card.bg + ' hover:' + card.activeBg
          }`}
          onClick={() => onFilterChange(card.key)}
        >
          <span className={`text-4xl font-extrabold ${card.text} mb-2`}>
            {card.key === 'completed' && completed}
            {card.key === 'upcoming' && upcoming}
            {card.key === 'canceled' && canceled}
            {card.key === 'all' && total}
          </span>
          <span className={`text-lg font-medium ${card.text}`}>{card.label}</span>
          {card.key === 'completed' && card.extra(lastCompleted)}
          {card.key === 'upcoming' && card.extra(nextUpcoming)}
        </div>
      ))}
    </div>
  );
} 