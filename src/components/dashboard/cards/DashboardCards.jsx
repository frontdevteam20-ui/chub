import React from 'react';
import { FaChartBar, FaUsers, FaRegNewspaper, FaFileInvoiceDollar } from 'react-icons/fa';

export const DashboardCard = ({ title, value, icon: Icon, color, gradientFrom, gradientTo, onClick }) => (
  <div 
    className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer`}
    onClick={onClick}
  >
    <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
    <div className="relative z-10">
      <span className="text-3xl font-bold text-white mb-2 block">{value}</span>
      <span className={`text-${color}-100 font-medium`}>{title}</span>
    </div>
    <div className="absolute top-4 right-4">
      <Icon className="w-8 h-8 text-white opacity-80" />
    </div>
  </div>
);

const DashboardCards = ({ stats, onCardClick }) => {
  const cardConfigs = [
    {
      title: 'Active Users',
      value: stats.activeUsers ?? '...',
      icon: FaUsers,
      color: 'cyan',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'via-cyan-500 to-blue-600',
      key: 'activeUsers'
    },
    {
      title: 'Leads',
      value: stats.leads ?? '24',
      icon: FaUsers,
      color: 'emerald',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'via-emerald-500 to-teal-600',
      key: 'leads'
    },
    {
      title: 'Total Blogs',
      value: stats.totalBlogs ?? '...',
      icon: FaRegNewspaper,
      color: 'purple',
      gradientFrom: 'from-purple-500',
      gradientTo: 'via-purple-600 to-indigo-700',
      key: 'totalBlogs'
    },
    {
      title: 'Pricing Quotations',
      value: stats.pricingQuotations ?? '8',
      icon: FaFileInvoiceDollar,
      color: 'orange',
      gradientFrom: 'from-orange-400',
      gradientTo: 'via-orange-500 to-red-500',
      key: 'pricingQuotations'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardConfigs.map((card) => (
        <DashboardCard
          key={card.key}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          gradientFrom={card.gradientFrom}
          gradientTo={card.gradientTo}
          onClick={() => onCardClick?.(card.key)}
        />
      ))}
    </div>
  );
};

export default DashboardCards;
