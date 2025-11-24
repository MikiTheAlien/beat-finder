# Custom Domain Setup for Railway

This guide explains how to connect `beat-finder.undrstnd.ch` for the frontend and `beat-finder-api.undrstnd.ch` for the backend API.

## Architecture

- **Frontend**: Serves at `beat-finder.undrstnd.ch/`
- **Backend API**: Serves at `beat-finder-api.undrstnd.ch/api/v1/*`
- **Health Check**: Available at `beat-finder-api.undrstnd.ch/health`

The frontend calls the backend API directly using the public backend URL.

## Setup Steps

### Step 1: Set Up Backend Custom Domain

1. **In Railway Dashboard**:
   - Go to Backend Service → **Settings** → **Networking**
   - Click **"Custom Domain"** or **"Add Domain"**
   - Enter: `beat-finder-api.undrstnd.ch`
   - Railway will provide you with a CNAME record

2. **In Your DNS Provider** (where `undrstnd.ch` is managed):
   - Add a CNAME record:
     - **Name**: `beat-finder-api` (or `beat-finder-api.undrstnd.ch` depending on your DNS provider)
     - **Value**: The CNAME value provided by Railway (e.g., `xxxxx.railway.app`)
     - **TTL**: 3600 (or default)

3. **Wait for DNS Propagation**:
   - DNS changes can take a few minutes to several hours
   - Railway will automatically provision SSL certificate once DNS is verified

### Step 2: Set Up Frontend Custom Domain

1. **In Railway Dashboard**:
   - Go to Frontend Service → **Settings** → **Networking**
   - Click **"Custom Domain"** or **"Add Domain"**
   - Enter: `beat-finder.undrstnd.ch`
   - Railway will provide you with a CNAME record

2. **In Your DNS Provider** (where `undrstnd.ch` is managed):
   - Add a CNAME record:
     - **Name**: `beat-finder` (or `beat-finder.undrstnd.ch` depending on your DNS provider)
     - **Value**: The CNAME value provided by Railway (e.g., `xxxxx.railway.app`)
     - **TTL**: 3600 (or default)

3. **Wait for DNS Propagation**:
   - DNS changes can take a few minutes to several hours
   - Railway will automatically provision SSL certificate once DNS is verified

### Step 3: Configure Frontend Environment Variables

In Railway Dashboard → Frontend Service → Variables:

```bash
NEXT_PUBLIC_API_URL="https://beat-finder-api.undrstnd.ch"
NEXT_PUBLIC_BETA="true"
```

**Important**: 
- `NEXT_PUBLIC_API_URL` should be the full public backend URL: `https://beat-finder-api.undrstnd.ch`
- No trailing slash
- For local development, you can set it to `http://localhost:8000`

### Step 4: Configure Backend Environment Variables

In Railway Dashboard → Backend Service → Variables:

```bash
PORT="8000"
FRONTEND_URL="https://beat-finder.undrstnd.ch"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"
```

**Important**:
- `FRONTEND_URL` must include `https://` protocol
- No trailing slash
- This is used for CORS configuration

### Step 5: Verify Setup

1. **Check DNS**:
   ```bash
   dig beat-finder.undrstnd.ch CNAME
   dig beat-finder-api.undrstnd.ch CNAME
   ```

2. **Test Frontend**:
   - Visit: `https://beat-finder.undrstnd.ch`
   - Should load the frontend

3. **Test Backend Health**:
   - Visit: `https://beat-finder-api.undrstnd.ch/health`
   - Should return: `{"status": "healthy"}`

4. **Test API Endpoint**:
   - Visit: `https://beat-finder-api.undrstnd.ch/api/v1/docs`
   - Should show FastAPI documentation

5. **Test Beta Signup**:
   - Use the form on `https://beat-finder.undrstnd.ch`
   - Should successfully submit to `https://beat-finder-api.undrstnd.ch/api/v1/beta-signup`

## How It Works

### Direct API Calls

The frontend makes direct HTTP requests to the backend's public URL:

- Frontend at: `https://beat-finder.undrstnd.ch`
- Backend at: `https://beat-finder-api.undrstnd.ch`
- API calls: `https://beat-finder-api.undrstnd.ch/api/v1/beta-signup`

The `frontend/utils/api.ts` utility handles URL construction:
- Reads `NEXT_PUBLIC_API_URL` environment variable
- Appends `/api/v1` prefix to all endpoints
- Handles protocol normalization

### CORS Configuration

The backend is configured to allow requests from:
- `https://beat-finder.undrstnd.ch` (production frontend)
- `http://localhost:3000` (local development)
- `https://localhost:3000` (local development with HTTPS)

## Troubleshooting

### CNAME Not Working

1. **Check DNS Records**:
   ```bash
   dig beat-finder.undrstnd.ch CNAME
   dig beat-finder-api.undrstnd.ch CNAME
   ```
   - Should show Railway's CNAME values

2. **Verify in Railway**:
   - Go to Service → Settings → Networking
   - Check domain status (should show "Active" when ready)

3. **Wait for SSL**:
   - Railway automatically provisions SSL certificates
   - Can take a few minutes after DNS is verified

### API Requests Failing

1. **Check NEXT_PUBLIC_API_URL**:
   - Verify `NEXT_PUBLIC_API_URL` is set correctly in frontend service
   - Should be `https://beat-finder-api.undrstnd.ch`
   - No trailing slash

2. **Check Backend Service**:
   - Verify backend is running and healthy
   - Check backend logs for errors

3. **Test Direct Backend Access**:
   - Visit `https://beat-finder-api.undrstnd.ch/health` directly
   - If that works, the issue is with the frontend configuration

### CORS Errors

1. **Verify FRONTEND_URL**:
   - Backend's `FRONTEND_URL` should be `https://beat-finder.undrstnd.ch`
   - Must include `https://` protocol
   - No trailing slash

2. **Check Backend CORS Configuration**:
   - Backend should allow requests from `https://beat-finder.undrstnd.ch`
   - Check backend logs for CORS errors

## Security Notes

1. **SSL**: Railway automatically provides SSL certificates for custom domains
2. **CORS**: Backend CORS is configured to only allow requests from your frontend domain
3. **Environment Variables**: Never commit secrets - use Railway's environment variables
4. **Public URLs**: Both frontend and backend use public URLs, so ensure proper CORS and authentication
