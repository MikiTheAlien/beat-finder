# Railway Deployment Fixes

## Issues Fixed

### 1. ✅ API Path Structure
- **Problem**: Backend was using `/api` prefix, but you need `/api/beat-finder/v1`
- **Fix**: Updated backend routes to use `/api/beat-finder/v1` prefix
- **Files Changed**: `backend/main.py`

### 2. ✅ Frontend API URL Handling
- **Problem**: Frontend was hardcoding `/api` in API calls, causing double paths
- **Fix**: Created utility function `buildApiUrl()` that handles both cases:
  - If URL includes path: `api.undrstnd.ch/api/beat-finder/v1` → just append endpoint
  - If URL is just domain: `api.undrstnd.ch` → append full path
- **Files Changed**: 
  - `frontend/utils/api.ts` (new file)
  - `frontend/app/[locale]/page.tsx`
  - `frontend/components/BetaSignup.tsx`
  - `frontend/components/EmailVerification.tsx`

### 3. ✅ CORS Configuration
- **Problem**: CORS wasn't handling URLs without protocol
- **Fix**: Added URL normalization to add `https://` if missing
- **Files Changed**: `backend/main.py`

### 4. ✅ Environment Variable Handling
- **Problem**: Empty strings in Railway weren't handled properly
- **Fix**: Added validators to convert empty strings to `None` or defaults
- **Files Changed**: `backend/backend/config.py`

### 5. ✅ Protocol Handling
- **Problem**: URLs missing `https://` protocol
- **Fix**: Frontend API utility automatically adds protocol
- **Files Changed**: `frontend/utils/api.ts`

## Correct Environment Variables

### Frontend (Railway)
```bash
NEXT_PUBLIC_API_URL="/api/v1"
NEXT_PUBLIC_BETA="true"
```

**Important**: 
- ✅ Use relative path `/api/v1` (recommended) since frontend and API are on same domain
- ✅ Or use absolute URL: `https://beat-finder.undrstnd.ch/api/v1`
- ❌ No trailing slash

### Backend (Railway)
```bash
FRONTEND_URL="https://beat-finder.undrstnd.ch"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"
CLOUDFLARE_EMAIL_API_TOKEN="your-cloudflare-token-here"
EMAIL_VERIFICATION_SECRET="your-secret-key-here"
```

**Important**:
- ✅ Must include `https://` for `FRONTEND_URL`
- ✅ No trailing slashes
- ⚠️ `HUBSPOT_ACCESS_TOKEN` and `CLOUDFLARE_EMAIL_API_TOKEN` can be empty (but features won't work)
- ⚠️ `EMAIL_VERIFICATION_SECRET` should be a strong random string (not empty!)

## What You Need to Do

### Step 1: Update Environment Variables in Railway

1. **Frontend Service**:
   - Go to Railway Dashboard → Frontend Service → Variables
   - Update `NEXT_PUBLIC_API_URL` to: `/api/v1` (relative path, recommended)
   - Or use absolute: `https://beat-finder.undrstnd.ch/api/v1`
   - Make sure `NEXT_PUBLIC_BETA` is set to `"true"`

2. **Backend Service**:
   - Go to Railway Dashboard → Backend Service → Variables
   - Update `FRONTEND_URL` to: `https://beat-finder.undrstnd.ch`
   - Set `HUBSPOT_ACCESS_TOKEN` (you had it empty - set it to your token)
   - Set `CLOUDFLARE_EMAIL_API_TOKEN` (you had it set to HubSpot token - fix this!)
   - Set `EMAIL_VERIFICATION_SECRET` to a strong random string

### Step 2: Fix Your Current Variables

**Current (WRONG):**
```
CLOUDFLARE_EMAIL_API_TOKEN="your-hubspot-token-here"  # This is your HubSpot token!
HUBSPOT_ACCESS_TOKEN=""  # Empty!
```

**Should be:**
```
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"  # Your HubSpot token
CLOUDFLARE_EMAIL_API_TOKEN="your-actual-cloudflare-token"  # Your Cloudflare token
```

### Step 3: Redeploy

After updating variables:
1. Railway will automatically redeploy, OR
2. Manually trigger a redeploy from the dashboard

### Step 4: Verify

1. **Backend Health Check**: 
   - Visit: `https://beat-finder.undrstnd.ch/health`
   - Should return: `{"status": "healthy"}`

2. **Backend API Docs**:
   - Visit: `https://beat-finder.undrstnd.ch/api/v1/docs`
   - Should show FastAPI documentation

3. **Frontend**:
   - Visit: `https://beat-finder.undrstnd.ch`
   - Should load without errors
   - Check browser console for any API errors

## API Endpoints (New Structure)

All API endpoints are now under `/api/v1/`:

- `POST /api/v1/upload` - Upload audio file
- `GET /api/v1/process/{job_id}/status` - Check status
- `POST /api/v1/verify-email` - Send verification code
- `POST /api/v1/verify-code` - Verify code
- `GET /api/v1/download/{job_id}` - Download XML
- `POST /api/v1/beta-signup` - Beta signup
- `GET /health` - Health check (no prefix)

## Troubleshooting

### Apps Don't Start

1. **Check Railway Logs**:
   - Go to service → Deployments → Click latest → View Logs
   - Look for error messages

2. **Common Issues**:
   - Missing environment variables
   - Wrong variable values (missing protocol, trailing slashes)
   - Build failures (check Dockerfile)

3. **Backend Won't Start**:
   - Check that `PORT` is set (Railway sets this automatically)
   - Verify all required environment variables are set
   - Check logs for Python errors

4. **Frontend Won't Start**:
   - Check that `NEXT_PUBLIC_API_URL` is set correctly
   - Verify build completes successfully
   - Check logs for Next.js errors

### API Calls Fail

1. **CORS Errors**:
   - Verify `FRONTEND_URL` in backend matches frontend domain exactly
   - Check browser console for CORS error details
   - Verify backend logs show correct CORS origins

2. **404 Not Found**:
   - Verify `NEXT_PUBLIC_API_URL` is set to `/api/v1` (relative) or full URL
   - Check that endpoint exists in backend
   - Verify backend is using `/api/v1` path structure

3. **Connection Refused**:
   - Verify backend is running and healthy
   - Check backend URL is correct
   - Verify network/firewall settings

## Next Steps

1. ✅ Update environment variables in Railway
2. ✅ Fix the token mix-up (HubSpot vs Cloudflare)
3. ✅ Set a proper `EMAIL_VERIFICATION_SECRET`
4. ✅ Redeploy both services
5. ✅ Test the application
6. ✅ Monitor logs for any errors

## Files Changed

- `backend/main.py` - Updated API prefix and CORS
- `backend/backend/config.py` - Added validators for empty strings
- `frontend/utils/api.ts` - New utility for API URL handling
- `frontend/app/[locale]/page.tsx` - Updated to use new API utility
- `frontend/components/BetaSignup.tsx` - Updated to use new API utility
- `frontend/components/EmailVerification.tsx` - Updated to use new API utility

All changes are backward compatible with localhost development.

