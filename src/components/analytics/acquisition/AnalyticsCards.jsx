// src/components/analytics/acquisition/AnalyticsCards.jsx
import React from 'react';
import { FaUsers, FaClock, FaChartLine, FaArrowDown } from 'react-icons/fa';

const AnalyticsCard = ({ value, label, icon: Icon, gradientFrom, gradientTo }) => (
  <div 
    className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300`}
  >
    <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
    <div className="relative z-10">
      <span className="text-3xl font-bold text-white mb-2 block">{value}</span>
      <span className="text-white/80 font-medium">{label}</span>
    </div>
    <div className="absolute top-4 right-4">
      <Icon className="w-8 h-8 text-white opacity-80" />
    </div>
  </div>
);

export default function AnalyticsCards({ analyticsData }) {
  const cardConfigs = [
    {
      value: analyticsData.sessions.toLocaleString(),
      label: 'Sessions',
      icon: FaUsers,
      gradientFrom: 'from-blue-400',
      gradientTo: 'via-blue-500 to-indigo-600',
      key: 'sessions'
    },
    {
      value: analyticsData.avgEngagementTime,
      label: 'Avg Engagement Time',
      icon: FaClock,
      gradientFrom: 'from-emerald-400',
      gradientTo: 'via-emerald-500 to-teal-600',
      key: 'engagementTime'
    },
    {
      value: analyticsData.keyEvents.toLocaleString(),
      label: 'Key Events',
      icon: FaChartLine,
      gradientFrom: 'from-purple-500',
      gradientTo: 'via-purple-600 to-violet-700',
      key: 'keyEvents'
    },
    {
      value: `${analyticsData.bounceRate}%`,
      label: 'Bounce Rate',
      icon: FaArrowDown,
      gradientFrom: 'from-red-400',
      gradientTo: 'via-red-500 to-pink-600',
      key: 'bounceRate'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 w-full">
      {cardConfigs.map((card) => (
        <AnalyticsCard
          key={card.key}
          value={card.value}
          label={card.label}
          icon={card.icon}
          gradientFrom={card.gradientFrom}
          gradientTo={card.gradientTo}
        />
      ))}
    </div>
  );
}
