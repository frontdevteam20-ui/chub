// src/components/analytics/acquisition/constants.js
export const analyticsData = {
    sessions: 12340,
    avgEngagementTime: 145,
    keyEvents: 45680,
    bounceRate: 23.5
  };
  
  // chartData removed: chart will be generated dynamically from tableData
// Only chartOptions and other exports remain.

  
  export const tableData = [
    {
      channel: 'Total',
      totalUsers: 854,
      newUsers: 845,
      returningUsers: 210,
      avgEngagementTime: '1m 46s',
      engagedSessions: 0.86,
      eventCount: 7289,
      keyEvents: 0.00,
      userKeyEventRate: '0%',
      percentage: '100%'
    },
    // ... other rows
  ];
  
  export const chartOptions = {
    title: '',
    curveType: 'function',
    legend: { position: 'bottom' },
    backgroundColor: 'transparent',
    chartArea: {
      backgroundColor: 'transparent',
      left: 60,
      top: 60,
      right: 40,
      bottom: 80,
    },
    hAxis: {
      textStyle: { color: '#6B7280', fontSize: 12 },
      gridlines: { color: '#E5E7EB' },
      title: ''
    },
    vAxis: {
      textStyle: { color: '#6B7280', fontSize: 12 },
      gridlines: { color: '#E5E7EB' },
      title: 'Users',
      minValue: 0,
      maxValue: 100
    },
    colors: ['#60A5FA', '#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'],
    lineWidth: 3,
    pointSize: 4
  };
  