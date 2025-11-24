# Environment Variables Configuration Guide

This document explains how to properly configure environment variables for Railway deployment.

## Important Notes

1. **URLs must include protocol**: Always use `https://` (or `http://` for localhost)
2. **No trailing slashes**: Don't add trailing slashes to URLs
3. **Empty strings**: For optional variables, you can leave them empty, but it's better to omit them or set to a default value

## Frontend Environment Variables

### Required Variables

```bash
NEXT_PUBLIC_API_URL="https://api.undrstnd.ch/api/beat-finder/v1"
```

**Important**: 
- Must include the full path: `/api/beat-finder/v1`
- Must include protocol: `https://`
- The frontend will automatically append endpoint paths (e.g., `/upload`, `/verify-email`)

### Optional Variables

```bash
NEXT_PUBLIC_BETA="true"  # Set to "true" to enable beta mode, "false" or omit for production
```

## Backend Environment Variables

### Required Variables

```bash
FRONTEND_URL="https://beat-finder.undrstnd.ch"
```

**Important**:
- Must include protocol: `https://`
- No trailing slash
- This is used for CORS configuration

### Optional Variables (but recommended)

```bash
HUBSPOT_ACCESS_TOKEN="pat-eu1-..."  # Leave empty if not using HubSpot
CLOUDFLARE_EMAIL_API_TOKEN="..."    # Leave empty if not using Cloudflare Email
EMAIL_VERIFICATION_SECRET="..."     # Generate a strong random string
```

**Note**: 
- If `HUBSPOT_ACCESS_TOKEN` is empty, beta signup will still work but won't store leads
- If `CLOUDFLARE_EMAIL_API_TOKEN` is empty, email verification won't work
- If `EMAIL_VERIFICATION_SECRET` is empty, it defaults to "changeme" (not secure for production!)

## Correct Configuration Examples

### ✅ Correct Setup

**Frontend:**
```
NEXT_PUBLIC_API_URL="https://api.undrstnd.ch/api/beat-finder/v1"
NEXT_PUBLIC_BETA="true"
```

**Backend:**
```
FRONTEND_URL="https://beat-finder.undrstnd.ch"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"
CLOUDFLARE_EMAIL_API_TOKEN="your-cloudflare-token"
EMAIL_VERIFICATION_SECRET="your-secret-key-here"
```

### ❌ Incorrect Setup (Common Mistakes)

**Frontend:**
```
# Missing protocol
NEXT_PUBLIC_API_URL="api.undrstnd.ch/api/beat-finder/v1"

# Missing path
NEXT_PUBLIC_API_URL="https://api.undrstnd.ch"

# Trailing slash
NEXT_PUBLIC_API_URL="https://api.undrstnd.ch/api/beat-finder/v1/"
```

**Backend:**
```
# Missing protocol
FRONTEND_URL="beat-finder.undrstnd.ch"

# Trailing slash
FRONTEND_URL="https://beat-finder.undrstnd.ch/"
```

## Railway Configuration

### Setting Variables in Railway Dashboard

1. Go to your service in Railway
2. Click on the **Variables** tab
3. Click **+ New Variable**
4. Enter the variable name and value
5. Click **Add**

### Setting Variables via CLI

```bash
# Frontend
cd frontend
railway variables set NEXT_PUBLIC_API_URL="https://api.undrstnd.ch/api/beat-finder/v1"
railway variables set NEXT_PUBLIC_BETA="true"

# Backend
cd backend
railway variables set FRONTEND_URL="https://beat-finder.undrstnd.ch"
railway variables set HUBSPOT_ACCESS_TOKEN="pat-eu1-..."
railway variables set CLOUDFLARE_EMAIL_API_TOKEN="..."
railway variables set EMAIL_VERIFICATION_SECRET="..."
```

## Verification

After setting environment variables:

1. **Redeploy** both services (Railway will automatically redeploy when variables change, or trigger manually)
2. **Check logs** for any configuration errors
3. **Test the API**:
   - Frontend: Visit your frontend URL
   - Backend health: `https://api.undrstnd.ch/health`
   - Backend API: `https://api.undrstnd.ch/api/beat-finder/v1/` (should show API docs)

## Troubleshooting

### CORS Errors

- Verify `FRONTEND_URL` matches your frontend domain exactly (with `https://`)
- Check browser console for the exact CORS error
- Verify backend logs show the correct CORS origins

### API Not Found (404)

- Verify `NEXT_PUBLIC_API_URL` includes the full path: `/api/beat-finder/v1`
- Check that the backend is using the new path structure
- Verify the endpoint exists in the backend

### Empty String Issues

If you set a variable to an empty string `""` in Railway:
- Optional variables (like `HUBSPOT_ACCESS_TOKEN`) will be treated as `None`
- Required variables will cause errors
- Better to omit the variable or set a default value

## Security Notes

1. **Never commit** environment variables to git
2. **Use strong secrets** for `EMAIL_VERIFICATION_SECRET`
3. **Rotate tokens** regularly
4. **Use Railway's secret management** - variables are encrypted at rest

