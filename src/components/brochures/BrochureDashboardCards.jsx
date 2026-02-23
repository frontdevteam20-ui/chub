import React from "react";
import { FaBusinessTime, FaFileAlt, FaIndustry, FaChartBar } from 'react-icons/fa';

const BrochureDashboardCard = ({ title, value, icon: Icon, color, gradientFrom, gradientTo, loading }) => {
  // Define color classes mapping
  const colorClasses = {
    teal: 'text-teal-100',
    cyan: 'text-cyan-100',
    pink: 'text-pink-100',
    yellow: 'text-yellow-100'
  };

  return (
    <div 
      className={`relative overflow-hidden bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300`}
    >
      <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
      <div className="relative z-10 text-center">
        <span className="text-3xl font-bold text-white mb-2 block">{loading ? '...' : value}</span>
        <span className={`${colorClasses[color] || 'text-white'} font-medium`}>{title}</span>
      </div>
      <div className="absolute top-4 right-4">
        <Icon className="w-8 h-8 text-white opacity-80" />
      </div>
    </div>
  );
};

const BrochureDashboardCards = ({ 
  totalBrochures, 
  newBrochuresThisWeek, 
  brochuresToday, 
  brochuresThisMonth, 
  loading,
  industryStats,
  sortedIndustries 
}) => {
  // Get top 3 industries
  const topIndustries = sortedIndustries?.slice(0, 3) || [];
  const topIndustry = topIndustries[0];
  const topIndustryCount = topIndustry ? industryStats[topIndustry] : 0;

  const cardConfigs = [
    {
      title: 'Total Brochures',
      value: totalBrochures,
      icon: FaFileAlt,
      color: 'teal',
      gradientFrom: 'from-teal-400',
      gradientTo: 'via-teal-500 to-cyan-600',
      key: 'totalBrochures'
    },
    {
      title: 'New This Week',
      value: newBrochuresThisWeek,
      icon: FaBusinessTime,
      color: 'cyan',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'via-cyan-500 to-blue-600',
      key: 'newThisWeek'
    },
    {
      title: 'Brochures Today',
      value: brochuresToday,
      icon: FaBusinessTime,
      color: 'pink',
      gradientFrom: 'from-pink-400',
      gradientTo: 'via-pink-500 to-rose-600',
      key: 'brochuresToday'
    },
    {
      title: 'This Month',
      value: brochuresThisMonth,
      icon: FaFileAlt,
      color: 'yellow',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'via-yellow-500 to-orange-600',
      key: 'thisMonth'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cardConfigs.map((card) => (
        <BrochureDashboardCard
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

      {/* Top Industry Card - Full Width */}
      {topIndustry && (
        <div className="col-span-full">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FaIndustry className="text-teal-500" />
                Top Performing Industries
              </h3>
              <FaChartBar className="text-gray-400 w-5 h-5" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topIndustries.map((industry, index) => (
                <div key={industry} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">#{index + 1}</span>
                    <span className="text-xs text-gray-500">
                      {((industryStats[industry] / totalBrochures) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="font-bold text-lg text-gray-800 truncate mb-1">{industry}</div>
                  <div className="text-2xl font-bold text-teal-600">{industryStats[industry]}</div>
                  <div className="text-xs text-gray-500 mt-1">brochures downloaded</div>
                  
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-teal-400 to-cyan-500 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${(industryStats[industry] / Math.max(...Object.values(industryStats))) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {sortedIndustries.length > 3 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{sortedIndustries.length}</span> total industries tracked
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BrochureDashboardCards; 