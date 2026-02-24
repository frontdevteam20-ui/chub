const express = require('express');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const analyticsDataClient = new BetaAnalyticsDataClient({
  credentials: {
    client_email: process.env.GA_CLIENT_EMAIL,
    private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.GA_PROJECT_ID,
  },
});

const propertyId = process.env.GA_PROPERTY_ID;

// Helper: default metrics and dimensions
const DEFAULT_METRIC = 'activeUsers';
const DEFAULT_DIMENSIONS = ['date'];

app.get('/api/analytics', async (req, res) => {
  try {
    const { period, metric, dimensions, startDate, endDate } = req.query; // metric: string, dimensions: comma-separated string
    let dateRange;
    
    // Handle custom date range
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      // Use predefined periods
      if (period === 'day') dateRange = { startDate: '1daysAgo', endDate: 'today' };
      else if (period === 'week') dateRange = { startDate: '7daysAgo', endDate: 'today' };
      else if (period === 'month') dateRange = { startDate: '30daysAgo', endDate: 'today' };
      else if (period === 'year') dateRange = { startDate: '365daysAgo', endDate: 'today' };
      else if (period === 'custom') dateRange = { startDate, endDate };
      else dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }

    // Parse metrics and dimensions
    const metrics = (metric ? metric.split(',') : [DEFAULT_METRIC]).map((m) => ({ name: m }));
    const dims = (dimensions ? dimensions.split(',') : DEFAULT_DIMENSIONS).map((d) => ({ name: d }));

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics,
      dimensions: dims,
    });

    // Build result rows
    const result = response.rows.map(row => {
      const dimObj = {};
      row.dimensionValues.forEach((v, i) => {
        dimObj[dims[i].name] = v.value;
      });
      const metricObj = {};
      row.metricValues.forEach((v, i) => {
        metricObj[metrics[i].name] = v.value;
      });
      return { ...dimObj, ...metricObj };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add totals endpoint for frontend compatibility
app.get('/api/analytics/totals', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('📊 WebAnalytics Totals API Request:', { startDate, endDate });
    
    // Set default date range if not provided
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }
    
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'sessions' }
      ],
    });

    const result = {
      totalViews: response.rows?.[0]?.metricValues?.[0]?.value || '0',
      totalUsers: response.rows?.[0]?.metricValues?.[1]?.value || '0',
      totalSessions: response.rows?.[0]?.metricValues?.[2]?.value || '0',
      totalEvents: response.rows?.[0]?.metricValues?.[3]?.value || '0',
    };

    console.log('📊 WebAnalytics Totals API Response:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ Totals API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add event-count-by-name endpoint for EventSummaryCard
app.get('/api/analytics/event-count-by-name', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('📈 EventSummaryCard API Request:', { startDate, endDate });
    
    // Set default date range if not provided
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }
    
    // Fetch real data from Google Analytics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [{ name: 'eventCount' }],
      dimensions: [{ name: 'eventName' }],
    });

    const result = response.rows.map(row => ({
      eventName: row.dimensionValues[0].value,
      eventCount: parseInt(row.metricValues[0].value) || 0,
    }));
    
    console.log('📊 EventSummaryCard API Response:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ Event count API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add user-activity-summary endpoint for UserActivityChart
app.get('/api/analytics/user-activity-summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('📈 UserActivityChart API Request:', { startDate, endDate });
    
    // Set default date range if not provided
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }
    
    // Fetch real data from Google Analytics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'date' }],
    });

    const result = response.rows.map(row => ({
      date: row.dimensionValues[0].value,
      activeUsers: parseInt(row.metricValues[0].value) || 0,
    }));
    
    console.log('📊 UserActivityChart API Response:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ User activity summary API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add country-active-users endpoint for ActiveCountry component
app.get('/api/analytics/country-active-users', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('🌍 ActiveCountry API Request:', { startDate, endDate });
    
    // Set default date range if not provided
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }
    
    // Fetch real data from Google Analytics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'country' }],
    });
    
    // Process the real data
    const apiData = response.rows || [];
    const processedData = apiData.map(row => ({
      country: row.dimensionValues[0].value,
      countryName: row.dimensionValues[0].value,
      activeUsers: parseInt(row.metricValues[0].value) || 0
    }));
    
    console.log('🌍 ActiveCountry Real API Response:', processedData);
    res.json(processedData);
  } catch (err) {
    console.error('❌ ActiveCountry API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Add page-title-analytics endpoint for ScreenAnalytics component
app.get('/api/analytics/page-title-analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    console.log('📄 ScreenAnalytics API Request:', { startDate, endDate });
    
    // Set default date range if not provided
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }
    
    // Fetch real data from Google Analytics
    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' },
        { name: 'userEngagementDuration' },
        { name: 'bounceRate' }
      ],
      dimensions: [{ name: 'pageTitle' }],
    });
    
    // Process the real data
    const apiData = response.rows || [];
    const processedData = apiData.map(row => ({
      pageTitle: row.dimensionValues[0].value,
      views: parseInt(row.metricValues[0].value) || 0,
      activeUsers: parseInt(row.metricValues[1].value) || 0,
      avgEngagementTimePerUser: parseInt(row.metricValues[2].value) || 0,
      bounceRate: parseFloat(row.metricValues[3].value) || 0,
      bounceRateFormatted: `${((parseFloat(row.metricValues[3]?.value) || 0) * 100).toFixed(1)}%`,
      eventCount: 0, // Will be calculated from real data
      viewsPerActiveUser: row.metricValues[0] && row.metricValues[1] 
        ? (parseInt(row.metricValues[0].value) / parseInt(row.metricValues[1].value)).toFixed(2)
        : 0
    }));
    
    console.log('📄 ScreenAnalytics Real API Response:', processedData);
    res.json(processedData);
  } catch (err) {
    console.error('❌ ScreenAnalytics API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// User Acquisition Summary endpoint
app.get('/api/analytics/user-acquisition-summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('📊 User Acquisition Summary API Request:', { startDate, endDate });
    
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      metrics: [
        { name: 'sessions' },
        { name: 'averageEngagementTimePerActiveUser' },
        { name: 'keyEvents' },
        { name: 'bounceRate' }
      ],
    });

    const result = {
      sessions: response.rows?.[0]?.metricValues?.[0]?.value || '0',
      averageEngagementTimePerActiveUser: response.rows?.[0]?.metricValues?.[1]?.value || '0',
      totalKeyEvents: response.rows?.[0]?.metricValues?.[2]?.value || '0',
      bounceRate: parseFloat(response.rows?.[0]?.metricValues?.[3]?.value) || 0
    };

    console.log('📊 User Acquisition Summary API Response:', result);
    res.json(result);
  } catch (err) {
    console.error('❌ User Acquisition Summary API error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Traffic Acquisition endpoint
app.get('/api/analytics/traffic-acquisition', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    console.log('📊 Traffic Acquisition API Request:', { startDate, endDate });
    
    let dateRange;
    if (startDate && endDate) {
      dateRange = { startDate, endDate };
    } else {
      dateRange = { startDate: '30daysAgo', endDate: 'today' };
    }

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: dateRange.startDate, endDate: dateRange.endDate }],
      dimensions: [
        { name: 'sessionDefaultChannelGroup' },
        { name: 'date' }
      ],
      metrics: [
        { name: 'totalUsers' },
        { name: 'sessions' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
    });

    const apiData = response.rows || [];
    const processedData = apiData.map(row => ({
      channel: row.dimensionValues[0]?.value || 'Unknown',
      date: row.dimensionValues[1]?.value || '',
      totalUsers: parseInt(row.metricValues[0]?.value) || 0,
      sessions: parseInt(row.metricValues[1]?.value) || 0,
      averageSessionDuration: parseFloat(row.metricValues[2]?.value) || 0,
      bounceRate: parseFloat(row.metricValues[3]?.value) || 0
    }));

    console.log('📊 Traffic Acquisition API Response:', processedData);
    res.json({ rows: processedData });
  } catch (err) {
    console.error('❌ Traffic Acquisition API error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => console.log(`Analytics API running on port ${PORT} - accessible from network`));