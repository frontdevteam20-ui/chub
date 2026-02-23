import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  FaBlog, 
  FaEdit, 
  FaCalendarAlt, 
  FaFileAlt,
  FaComments,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import Navbar from '../Navbar';
import HamburgerMenu from '../HamburgerMenu';
import Footer from '../Footer';

const EditorDashboard = ({ handleLogout, user }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalPosts: 0,
    drafts: 0,
    published: 0,
    scheduled: 0,
    recentPosts: [],
    scheduledPosts: [],
    loading: true
  });

  useEffect(() => {
    const fetchBlogStats = async () => {
      try {
        const blogsRef = collection(db, 'blogs');
        const querySnapshot = await getDocs(blogsRef);
        
        const now = new Date();
        let totalPosts = 0;
        let drafts = 0;
        let published = 0;
        let scheduled = 0;
        const recentPosts = [];
        const scheduledPosts = [];
        
        querySnapshot.forEach((doc) => {
          const post = doc.data();
          totalPosts++;
          
          if (post.status === 'draft') {
            drafts++;
          } else if (post.status === 'published') {
            published++;
            // Get recent published posts (last 3)
            if (recentPosts.length < 3) {
              recentPosts.push({
                id: doc.id,
                title: post.title,
                date: post.publishedAt?.toDate() || post.createdAt?.toDate() || new Date(),
                views: post.views || 0
              });
            }
          } else if (post.status === 'scheduled' && post.publishDate) {
            const publishDate = post.publishDate.toDate();
            if (publishDate > now) {
              scheduled++;
              scheduledPosts.push({
                id: doc.id,
                title: post.title,
                date: publishDate
              });
            }
          }
        });
        
        // Sort recent posts by date (newest first)
        recentPosts.sort((a, b) => b.date - a.date);
        // Sort scheduled posts by date (soonest first)
        scheduledPosts.sort((a, b) => a.date - b.date);
        
        setDashboardData({
          totalPosts,
          drafts,
          published,
          scheduled,
          recentPosts: recentPosts.slice(0, 3),
          scheduledPosts: scheduledPosts.slice(0, 3),
          loading: false
        });
        
      } catch (error) {
        console.error('Error fetching blog stats:', error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };
    
    fetchBlogStats();
  }, []);
  
  const statCards = [
    { 
      title: 'Total Posts', 
      value: dashboardData.totalPosts, 
      icon: FaBlog, 
      color: 'bg-blue-100 text-blue-600',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-blue-600',
      key: 'totalPosts'
    },
    { 
      title: 'Drafts', 
      value: dashboardData.drafts, 
      icon: FaEdit, 
      color: 'bg-yellow-100 text-yellow-600',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-yellow-600',
      key: 'drafts'
    },
    { 
      title: 'Published', 
      value: dashboardData.published, 
      icon: FaFileAlt, 
      color: 'bg-green-100 text-green-600',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-green-600',
      key: 'published'
    },
    { 
      title: 'Scheduled', 
      value: dashboardData.scheduled, 
      icon: FaCalendarAlt, 
      color: 'bg-purple-100 text-purple-600',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      key: 'scheduled'
    },
  ];
  
  const handleCardClick = (cardKey) => {
    switch(cardKey) {
      case 'drafts':
        navigate('/admin/blogs?status=draft');
        break;
      case 'published':
        navigate('/admin/blogs?status=published');
        break;
      case 'scheduled':
        navigate('/admin/blogs?status=scheduled');
        break;
      default:
        navigate('/admin/blogs');
    }
  };

  const quickActions = [
    {
      id: 'create-blog',
      title: 'New Post',
      icon: <FaEdit className="text-lg" />,
      bgColor: 'bg-blue-100',
      hoverBgColor: 'hover:bg-blue-200',
      textColor: 'text-blue-600',
      onClick: () => navigate('/admin/blogs/new')
    },
    {
      id: 'view-drafts',
      title: 'View Drafts',
      icon: <FaFileAlt className="text-lg" />,
      bgColor: 'bg-yellow-100',
      hoverBgColor: 'hover:bg-yellow-200',
      textColor: 'text-yellow-600',
      onClick: () => navigate('/admin/blogs?status=draft')
    },
    {
      id: 'schedule-post',
      title: 'Schedule Post',
      icon: <FaCalendarAlt className="text-lg" />,
      bgColor: 'bg-purple-100',
      hoverBgColor: 'hover:bg-purple-200',
      textColor: 'text-purple-600',
      onClick: () => navigate('/admin/blogs/new?schedule=true')
    },
    {
      id: 'view-comments',
      title: 'Comments',
      icon: <FaComments className="text-lg" />,
      bgColor: 'bg-green-100',
      hoverBgColor: 'hover:bg-green-200',
      textColor: 'text-green-600',
      onClick: () => navigate('/admin/comments')
    }
  ];

  const recentActivity = dashboardData.recentPosts.map(post => ({
    id: post.id,
    title: post.title,
    description: format(post.date, 'MMM d, yyyy'),
    time: formatDistanceToNow(post.date, { addSuffix: true }),
    icon: FaCheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600'
  }));

  const upcomingSchedule = dashboardData.scheduledPosts.map(post => ({
    id: post.id,
    title: post.title,
    date: format(post.date, 'MMM d, yyyy'),
    time: format(post.date, 'h:mm a'),
    icon: FaClock
  }));

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white flex-col">
      <Navbar handleLogout={handleLogout} />
      <div className="flex-1 w-full">
        <div className="sm:block">
          <HamburgerMenu handleLogout={user?.signOut} user={user} />
        </div>
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white flex-col md:ml-64">
      {/* Header */}
      <div className='flex-1 w-full pt-20'>
      <div className='flex-1 max-w-6xl mx-auto p-4 mt-3'>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Content Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.displayName || 'Editor'}</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card) => (
          <div 
            key={card.key}
            onClick={() => handleCardClick(card.key)}
            className={`relative overflow-hidden bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} rounded-xl shadow-xl p-6 flex flex-col items-center transform hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            <div className="absolute top-0 left-0 w-20 h-20 bg-white opacity-10 rounded-full -ml-10 -mt-10"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mb-12"></div>
            <div className="relative z-10">
              <span className="text-3xl font-bold text-white mb-2 block">{card.value}</span>
              <span className="text-white/90 font-medium">{card.title}</span>
            </div>
            <div className="absolute top-4 right-4">
              <card.icon className="w-8 h-8 text-white/80" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow hover:shadow-md transition-all ${action.hoverBgColor} ${action.bgColor}`}
            >
              <span className={`text-2xl mb-2 ${action.textColor}`}>{action.icon}</span>
              <span className="text-sm font-medium text-gray-800">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
            <button 
              onClick={() => navigate('/admin/blogs')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${activity.iconBg} mr-3`}>
                    <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                    <div className="mt-1 text-xs text-gray-400">{activity.time}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No recent activity to show
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Schedule</h2>
            <button 
              onClick={() => navigate('/admin/blogs?status=scheduled')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {upcomingSchedule.length > 0 ? (
              upcomingSchedule.map((item) => (
                <div key={item.id} className="flex items-center p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
                    <FaCalendarAlt className="text-blue-500 w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
                    <p className="text-sm text-gray-500">Scheduled for {item.date} at {item.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No scheduled posts
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
      </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default EditorDashboard;
