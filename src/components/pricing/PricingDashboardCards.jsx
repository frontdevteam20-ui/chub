import React from "react";
import { FaFileInvoiceDollar, FaDollarSign, FaCalculator, FaChartLine } from 'react-icons/fa';

const PricingDashboardCard = ({ title, value, icon: Icon, color, gradientFrom, gradientTo, loading }) => (
  <div 
    className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300`}
  >
    <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
    <div className="relative z-10">
      <span className="text-3xl font-bold text-white mb-2 block">{loading ? '...' : value}</span>
      <span className={`text-${color}-100 font-medium`}>{title}</span>
    </div>
    <div className="absolute top-4 right-4">
      <Icon className="w-8 h-8 text-white opacity-80" />
    </div>
  </div>
);

const PricingDashboardCards = ({ loading, totalQuotations, newQuotationsThisWeek, quotationsToday, quotationsThisMonth }) => {
  const cardConfigs = [
    {
      title: 'Total Quotations',
      value: totalQuotations,
      icon: FaFileInvoiceDollar,
      color: 'emerald',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'via-emerald-500 to-teal-600',
      key: 'totalQuotations'
    },
    {
      title: 'New This Week',
      value: newQuotationsThisWeek,
      icon: FaDollarSign,
      color: 'cyan',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'via-cyan-500 to-blue-600',
      key: 'newThisWeek'
    },
    {
      title: 'Quotations Today',
      value: quotationsToday,
      icon: FaCalculator,
      color: 'pink',
      gradientFrom: 'from-pink-400',
      gradientTo: 'via-pink-500 to-rose-600',
      key: 'quotationsToday'
    },
    {
      title: 'This Month',
      value: quotationsThisMonth,
      icon: FaChartLine,
      color: 'yellow',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'via-yellow-500 to-orange-600',
      key: 'thisMonth'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardConfigs.map((card) => (
        <PricingDashboardCard
          key={card.key}
          title={card.title}
          value={card.value}
          icon={card.icon}
          color={card.color}
          gradientFrom={card.gradientFrom}
          gradientTo={card.gradientTo}
          loading={loading}
        />
      ))}
    </div>
  );
};

export default PricingDashboardCards;