# Railway Networking Setup Guide

## Current Setup

- **Frontend**: `beat-finder.undrstnd.ch` (CNAME configured ✅)
- **Backend**: No CNAME needed (accessed via private network ✅)

## How It Works

The frontend uses Next.js rewrites to proxy all `/api/v1/*` requests to the backend service. This means:

1. User visits: `https://beat-finder.undrstnd.ch/api/v1/beta-signup`
2. Next.js rewrite intercepts: `/api/v1/*` → proxies to backend
3. Backend receives request and processes it
4. Response is returned through the frontend

**You only need ONE CNAME** (for the frontend). The backend is accessed internally via Railway's private network.

## Step-by-Step Configuration

### Step 1: Get Backend Service URL

You have two options:

**Option A: Use Private Network (Recommended)**
- Go to Railway Dashboard → Backend Service → Settings → Networking
- Use the **Private Network URL**: `http://backend.railway.internal`
- This is faster and more secure (only accessible within Railway)

**Option B: Use Public Railway Domain**
- Go to Railway Dashboard → Backend Service → Settings → Networking
- Click "Generate Domain" if not already generated
- Use the public domain: `http://your-backend-service.up.railway.app`

### Step 2: Configure Frontend Environment Variables

In Railway Dashboard → **Frontend Service** → Variables:

```bash
NEXT_PUBLIC_API_URL="/api/v1"
NEXT_PUBLIC_BETA="true"
BACKEND_URL="http://backend.railway.internal"
```

**Important Notes:**
- `NEXT_PUBLIC_API_URL` should be `/api/v1` (relative path)
- `BACKEND_URL` should be the backend's private network URL or public Railway domain
- Do NOT include `/api/v1` in `BACKEND_URL` - the rewrite handles that
- Use `http://` (not `https://`) for Railway private network URLs

### Step 3: Configure Backend Environment Variables

In Railway Dashboard → **Backend Service** → Variables:

```bash
FRONTEND_URL="https://beat-finder.undrstnd.ch"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"
```

**Important Notes:**
- `FRONTEND_URL` must include `https://` protocol
- No trailing slash
- This is used for CORS configuration

### Step 4: Verify Backend is Running

1. Go to Railway Dashboard → Backend Service → Deployments
2. Check that the latest deployment is "Active"
3. Check the logs for any errors

### Step 5: Test the Setup

1. **Test Frontend**: Visit `https://beat-finder.undrstnd.ch`
   - Should load the frontend page

2. **Test API Health**: Visit `https://beat-finder.undrstnd.ch/health`
   - Should return: `{"status": "healthy"}`

3. **Test API Endpoint**: Try the beta signup form
   - Should successfully submit and return success message

## Troubleshooting 500 Errors

If you're getting a 500 Internal Server Error:

### 1. Check Backend Logs

```bash
# Using Railway CLI
railway logs --service backend

# Or check in Railway Dashboard
# Backend Service → Deployments → Latest → View Logs
```

Common issues:
- Missing environment variables
- Backend service not running
- Import errors or missing dependencies
- HubSpot API errors

### 2. Verify BACKEND_URL is Set

In Railway Dashboard → Frontend Service → Variables:
- Check that `BACKEND_URL` is set correctly
- Should be `http://backend.railway.internal` (private) or `http://your-backend.up.railway.app` (public)

### 3. Test Backend Directly

Try accessing the backend's public Railway domain directly:
```
http://your-backend-service.up.railway.app/health
```

If this works but the proxied request doesn't, the issue is with the rewrite configuration.

### 4. Check Next.js Rewrites

The `next.config.js` should have:

```javascript
async rewrites() {
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
  
  return [
    {
      source: '/api/v1/:path*',
      destination: `${backendUrl}/api/v1/:path*`,
    },
    {
      source: '/health',
      destination: `${backendUrl}/health`,
    },
  ];
}
```

### 5. Verify CORS Configuration

The backend should allow requests from `https://beat-finder.undrstnd.ch`. Check `backend/main.py` CORS configuration.

## Summary

✅ **Frontend**: Needs CNAME → `beat-finder.undrstnd.ch`
❌ **Backend**: No CNAME needed (accessed via private network)

**Frontend Environment Variables:**
- `NEXT_PUBLIC_API_URL="/api/v1"`
- `NEXT_PUBLIC_BETA="true"`
- `BACKEND_URL="http://backend.railway.internal"`

**Backend Environment Variables:**
- `FRONTEND_URL="https://beat-finder.undrstnd.ch"`
- `HUBSPOT_ACCESS_TOKEN="your-token"`

