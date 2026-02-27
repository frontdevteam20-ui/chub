# Analytics Backend API

This backend provides analytics data from Google Analytics Data API v1beta for the frontend dashboard.

## Features

- **Real-time Analytics**: Fetches live data from Google Analytics
- **Multiple Endpoints**: Supports various analytics metrics and dimensions
- **Date Range Support**: Flexible date filtering for custom periods
- **Production Ready**: Configured for OnRender deployment

## API Endpoints

### Core Analytics
- `GET /api/analytics` - General analytics with custom metrics/dimensions
- `GET /api/analytics/totals` - Summary totals (views, users, sessions, events)

### Specialized Endpoints
- `GET /api/analytics/event-count-by-name` - Event counts by event name
- `GET /api/analytics/user-activity-summary` - Daily user activity data
- `GET /api/analytics/country-active-users` - Users by country
- `GET /api/analytics/page-title-analytics` - Page-specific analytics
- `GET /api/analytics/user-acquisition-summary` - User acquisition metrics
- `GET /api/analytics/traffic-acquisition` - Traffic sources by channel

## Query Parameters

All endpoints support:
- `startDate` (YYYY-MM-DD format)
- `endDate` (YYYY-MM-DD format)

Example: `/api/analytics/totals?startDate=2024-01-01&endDate=2024-06-30`

## Deployment

### OnRender Setup

1. **Create a Render Account**
   - Sign up at [render.com](https://render.com)

2. **Connect Repository**
   - Connect your GitHub repository
   - Select the `backend` folder as root directory

3. **Configure Environment Variables**
   In Render dashboard, set these environment variables:
   ```
   GA_PROPERTY_ID=your_google_analytics_property_id
   GA_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key":"...","client_email":"...","client_id":"..."}
   NODE_ENV=production
   PORT=10000
   ```

4. **Deploy**
   - Render will automatically build and deploy
   - Your API will be available at: `https://your-app-name.onrender.com`

### Local Development

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Google Analytics credentials
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

## Google Analytics Setup

1. **Create Service Account**
   - Go to Google Cloud Console
   - Create a service account with "Analytics Data API" permissions
   - Download the JSON key file

2. **Get Property ID**
   - In Google Analytics 4, find your Property ID (usually 9 digits)

3. **Configure Backend**
   - Add service account JSON to `GA_SERVICE_ACCOUNT` environment variable
   - Set `GA_PROPERTY_ID` to your property ID

## Frontend Integration

Update your frontend to use the deployed API URL:

```javascript
const API_BASE_URL = "https://your-app-name.onrender.com";
```

## Monitoring

- Check Render dashboard for deployment logs
- Monitor API usage in Google Analytics
- Set up alerts for high traffic or errors
