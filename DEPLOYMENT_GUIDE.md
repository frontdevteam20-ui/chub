# OnRender Deployment Guide

## Backend API Deployment

### Prerequisites
- Google Analytics 4 Property ID
- Google Cloud Service Account with Analytics Data API access
- Render account
- GitHub repository with backend code

### Step 1: Prepare Google Analytics Service Account

1. **Create Service Account**
   ```
   - Go to Google Cloud Console
   - IAM & Admin → Service Accounts
   - Create Service Account
   - Add role: "Analytics Data API User"
   ```

2. **Generate JSON Key**
   ```
   - Click on service account
   - Keys → Add Key → Create new key
   - Download JSON file
   ```

3. **Enable Analytics API**
   ```
   - Go to APIs & Services → Library
   - Search and enable "Google Analytics Data API"
   ```

### Step 2: Configure Backend

1. **Update Environment Variables**
   - In your Render dashboard, set these environment variables:
   ```
   GA_PROPERTY_ID=your_property_id (9-digit number)
   GA_SERVICE_ACCOUNT=paste_the_entire_json_key_here
   NODE_ENV=production
   PORT=10000
   ```

2. **Service Account JSON Format**
   ```json
   {
     "type": "service_account",
     "project_id": "your-project-id",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "your-service-account@your-project.iam.gserviceaccount.com",
     "client_id": "...",
     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
     "token_uri": "https://oauth2.googleapis.com/token",
     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
     "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40your-project.iam.gserviceaccount.com"
   }
   ```

### Step 3: Deploy to Render

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set root directory: `backend`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Configure Settings**
   - Name: `analytics-api` (or your preferred name)
   - Plan: Free (or Starter for better performance)
   - Region: Choose closest to your users

3. **Add Environment Variables**
   - Add all variables from Step 2
   - Make sure to mark sensitive ones as "secret"

### Step 4: Test Deployment

1. **Check API Health**
   ```bash
   curl https://your-app-name.onrender.com/api/analytics/totals
   ```

2. **Verify Frontend Connection**
   - Update frontend API_BASE_URL to your Render URL
   - Test analytics dashboard functionality

### Step 5: Frontend Updates

Update `WebAnalytics.jsx`:
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? "https://your-app-name.onrender.com" 
    : "http://localhost:4000";
```

### Common Issues & Solutions

**CORS Issues**
- Backend already has CORS enabled
- If issues persist, check Render logs

**Authentication Errors**
- Verify GA_PROPERTY_ID is correct (9 digits)
- Check service account has proper permissions
- Ensure JSON key is properly formatted

**Performance Issues**
- Free plan has cold starts
- Consider Starter plan for production
- Implement caching if needed

### Monitoring

1. **Render Dashboard**
   - Monitor deployment logs
   - Check metrics and response times

2. **Google Analytics**
   - Monitor API usage quotas
   - Set up alerts for unusual activity

3. **Error Handling**
   - Backend has comprehensive error handling
   - Check console logs for debugging

### Security Notes

- Never commit service account keys to Git
- Use Render's secret environment variables
- Regularly rotate service account keys
- Monitor API usage for anomalies
