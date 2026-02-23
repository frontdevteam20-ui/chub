const express = require('express');
const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const analyticsDataClient = new BetaAnalyticsDataClient({
  keyFilename: process.env.GA_KEY_PATH,
});

const propertyId = process.env.GA_PROPERTY_ID;

// Helper: default metrics and dimensions
const DEFAULT_METRIC = 'activeUsers';
const DEFAULT_DIMENSIONS = ['date'];

app.get('/api/analytics', async (req, res) => {
  try {
    const { period, metric, dimensions } = req.query; // metric: string, dimensions: comma-separated string
    let startDate;
    if (period === 'day') startDate = '1daysAgo';
    else if (period === 'week') startDate = '7daysAgo';
    else if (period === 'month') startDate = '30daysAgo';
    else startDate = '7daysAgo';

    // Parse metrics and dimensions
    const metrics = (metric ? metric.split(',') : [DEFAULT_METRIC]).map((m) => ({ name: m }));
    const dims = (dimensions ? dimensions.split(',') : DEFAULT_DIMENSIONS).map((d) => ({ name: d }));

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
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

// Add summary endpoint for frontend compatibility
app.get('/api/analytics/summary', async (req, res) => {
  // Use the same logic as /api/analytics for stats
  req.query = { period: 'week', metric: 'activeUsers,newUsers,sessions,purchases,revenue' };
  app._router.handle(req, res, () => {});
});

// Add timeseries endpoint for frontend compatibility
app.get('/api/analytics/timeseries', async (req, res) => {
  // Use the same logic as /api/analytics for chart data
  req.query = { period: 'month', metric: 'sessions', dimensions: 'date' };
  app._router.handle(req, res, () => {});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Analytics API running on port ${PORT}`)); 