import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

// Import components
import DashboardCards from './cards/DashboardCards';
import QuickActions from './quick-actions/QuickActions';
import RecentActivity from './recent-activity/RecentActivity';
import DemoSchedule from './demo-schedule/DemoSchedule';

const Dashboard = ({ handleLogout, user }) => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalBlogs: 0,
    recentBlogs: [],
    activeUsers: null,
    loading: true
  });
  
  // Demo states
  const [recentDemos, setRecentDemos] = useState([]);
  const [upcomingDemos, setUpcomingDemos] = useState([]);
  const [loadingDemos, setLoadingDemos] = useState(true);

  useEffect(() => {
    const fetchCalendlyDemos = async () => {
      try {
        setLoadingDemos(true);
        // First get organization URI
        const userRes = await fetch('https://api.calendly.com/users/me', {
          headers: {
            'Authorization': `Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUyNTAxNjM0LCJqdGkiOiJmMmI0ZmE4ZC1iMzQ3LTQ2YzktODA2Ni1mNDA2Y2YwN2FiNTEiLCJ1c2VyX3V1aWQiOiIxYmI0NGE3YS1lY2EwLTRmNmEtOTA2Yi1hNzBiOTMzMzIzMmQifQ.cv0mOwuQM4C6TlTMUhGqM6tIhwNNL9_LSw_z6XYEWZcxFbD3238ygOZFLsVn23Gq7IaRHjQYHx2VKglChosBBA`,
            'Content-Type': 'application/json',
          },
        });
        
        if (!userRes.ok) throw new Error('Failed to fetch user info');
        const userData = await userRes.json();
        const orgUri = userData.resource?.current_organization;
        
        if (!orgUri) throw new Error('Organization URI not found');

        // Calculate date range for events (past 30 days to future)
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        
        // Format dates for Calendly API (ISO 8601 format)
        const minStartTime = thirtyDaysAgo.toISOString();
        
        // Then fetch events from Calendly API with date range
        const eventsRes = await fetch(
          `https://api.calendly.com/scheduled_events?organization=${encodeURIComponent(orgUri)}` +
          `&min_start_time=${encodeURIComponent(minStartTime)}`,
          {
            headers: {
              'Authorization': `Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzUyNTAxNjM0LCJqdGkiOiJmMmI0ZmE4ZC1iMzQ3LTQ2YzktODA2Ni1mNDA2Y2YwN2FiNTEiLCJ1c2VyX3V1aWQiOiIxYmI0NGE3YS1lY2EwLTRmNmEtOTA2Yi1hNzBiOTMzMzIzMmQifQ.cv0mOwuQM4C6TlTMUhGqM6tIhwNNL9_LSw_z6XYEWZcxFbD3238ygOZFLsVn23Gq7IaRHjQYHx2VKglChosBBA`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!eventsRes.ok) throw new Error('Failed to fetch events');
        const eventsData = await eventsRes.json();

        // Transform Calendly events to our demo format
        const formattedDemos = (eventsData.collection || [])
          .map(event => {
            try {
              const startTime = new Date(event.start_time);
              const endTime = new Date(event.end_time);
              
              // Skip if we can't parse the dates
              if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                console.warn('Skipping event with invalid date:', event);
                return null;
              }
              
              const now = new Date();
              const isCompleted = endTime < now;
              
              return {
                id: event.uri.split('/').pop(),
                title: event.name || 'Scheduled Demo',
                client: event.event_guests?.find(g => g.email)?.email?.split('@')[0] || 'Guest',
                date: startTime,
                time: startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: isCompleted ? 'completed' : 'upcoming',
                type: event.location?.type === 'physical' ? 'in-person' : 'video',
                meetingLink: event.location?.join_url || event.location?.location || null,
                endTime: endTime
              };
            } catch (error) {
              console.error('Error processing event:', event, error);
              return null;
            }
          })
          .filter(Boolean); // Remove any null entries from invalid events

        // Filter and sort demos
        const completedDemos = formattedDemos
          .filter(demo => demo.status === 'completed')
          .sort((a, b) => new Date(b.date) - new Date(a.date));
          
        const upcomingDemos = formattedDemos
          .filter(demo => demo.status === 'upcoming')
          .sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setRecentDemos(completedDemos);
        setUpcomingDemos(upcomingDemos);
        setLoadingDemos(false);
      } catch (err) {
        console.error('Error fetching Calendly demos:', err);
      } finally {
        setLoadingDemos(false);
      }
    };

    fetchCalendlyDemos();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch blogs count
        const blogsRef = collection(db, "blogs");
        const querySnapshot = await getDocs(blogsRef);
        
        // Fetch recent blogs
        const blogs = [];
        querySnapshot.forEach((doc) => {
          blogs.push({ id: doc.id, ...doc.data() });
        });
        
        // Sort by date and get recent 3
        const recentBlogs = [...blogs]
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
          .slice(0, 3)
          .map(blog => blog.title);

        setDashboardData({
          totalBlogs: blogs.length,
          recentBlogs,
          activeUsers: 24, // Mock data, replace with actual data
          leads: 15, // Mock data
          pricingQuotations: 8, // Mock data
          loading: false
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const handleCardClick = (cardKey) => {
    // Handle card click navigation
    switch(cardKey) {
      case 'activeUsers':
        navigate('/analytics/users');
        break;
      case 'leads':
        navigate('/leads');
        break;
      case 'totalBlogs':
        navigate('/blogs');
        break;
      case 'pricingQuotations':
        navigate('/pricing');
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-white flex-col md:ml-64">
      <div className="flex-1 w-full pt-20">
        <div className="flex-1 max-w-6xl mx-auto p-4 mt-3">
          {/* Dashboard Cards */}
          <DashboardCards 
            stats={dashboardData} 
            onCardClick={handleCardClick} 
          />
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <DemoSchedule demos={[...recentDemos, ...upcomingDemos]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
