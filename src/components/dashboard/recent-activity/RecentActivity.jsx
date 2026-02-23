import React from 'react';
import { FaUserPlus, FaRegNewspaper, FaFileInvoiceDollar, FaChartLine } from 'react-icons/fa';

const activityItems = [
  {
    id: 1,
    title: 'New leads added',
    description: '3 new leads were added this week',
    time: '2 hours ago',
    icon: FaUserPlus,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600'
  },
  {
    id: 2,
    title: 'Blog published',
    description: '2 new blog posts were published',
    time: '1 day ago',
    icon: FaRegNewspaper,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600'
  },
  {
    id: 3,
    title: 'Quotations sent',
    description: '5 pricing quotations were sent to clients',
    time: '2 days ago',
    icon: FaFileInvoiceDollar,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600'
  },
  {
    id: 4,
    title: 'Analytics updated',
    description: 'Website analytics have been refreshed',
    time: 'Just now',
    icon: FaChartLine,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600'
  }
];

const ActivityItem = ({ title, description, time, icon: Icon, iconBg, iconColor }) => (
  <div className="flex items-start p-3 bg-white/70 rounded-lg hover:bg-white transition-colors">
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBg} flex items-center justify-center mr-3`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      <p className="text-xs text-gray-500">{description}</p>
      <div className="mt-1 text-xs text-gray-400">{time}</div>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="mt-6">
    <h3 className="font-semibold text-blue-800 mb-3 text-lg text-start">Recent Activity</h3>
    <div className="max-h-64 overflow-y-auto pr-2 space-y-4">
      {activityItems.map((item) => (
        <ActivityItem key={item.id} {...item} />
      ))}
    </div>
  </div>
);

export default RecentActivity;
