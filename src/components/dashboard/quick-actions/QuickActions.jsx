import React from 'react';
import { FaBlog, FaUserPlus, FaChartLine, FaFileInvoiceDollar, FaDollarSign } from 'react-icons/fa';
import { BsGraphUp } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'create-blog',
      title: 'Create Blog',
      icon: <FaBlog className="text-lg" />,
      bgColor: 'bg-purple-100',
      hoverBgColor: 'hover:bg-purple-200',
      textColor: 'text-purple-600',
      onClick: () => navigate('/blogs/create')
    },
    {
      id: 'add-lead',
      title: 'Add Lead',
      icon: <FaUserPlus className="text-lg" />,
      bgColor: 'bg-emerald-100',
      hoverBgColor: 'hover:bg-emerald-200',
      textColor: 'text-emerald-600',
      onClick: () => navigate('/admin/leads/import')
    },
    {
      id: 'view-analytics',
      title: 'View Analytics',
      icon: <BsGraphUp className="text-lg" />,
      bgColor: 'bg-blue-100',
      hoverBgColor: 'hover:bg-blue-200',
      textColor: 'text-blue-600',
      onClick: () => navigate('/admin/analytics')
    },
    {
      id: 'manage-pricing',
      title: 'Manage Pricing',
      icon: <FaDollarSign className="text-lg" />,
      bgColor: 'bg-orange-100',
      hoverBgColor: 'hover:bg-orange-200',
      textColor: 'text-orange-600',
      onClick: () => navigate('/pricing')
    }
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg flex flex-col shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-blue-800 text-lg">Quick Actions</h3>
      </div>
      <div className="grid grid-cols-2 gap-4 w-full">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className={`flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow hover:shadow-md transition-all ${action.hoverBgColor}`}
          >
            <span className={`text-3xl mb-2 ${action.textColor}`}>{action.icon}</span>
            <span className="text-xs font-medium text-gray-800">{action.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
