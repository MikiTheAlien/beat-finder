# Railway Deployment Guide

This guide will walk you through deploying the Beat Finder application to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. Railway CLI installed (optional, but recommended)
3. Your environment variables ready (HubSpot token, Cloudflare email token, etc.)

## Option 1: Deploy via Railway Dashboard (Recommended for First Time)

### Step 1: Create a New Project

1. Go to [railway.app](https://railway.app) and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"** (if your repo is on GitHub)
   - OR select **"Empty Project"** if deploying manually

### Step 2: Deploy the Backend

1. In your Railway project, click **"+ New"** → **"GitHub Repo"** (or **"Empty Service"**)
2. If using GitHub:
   - Select your repository
   - Set the **Root Directory** to: `backend`
   - Railway will automatically detect the `railway.json` file
3. If using Empty Service:
   - Connect your GitHub repo or upload code
   - Set the **Root Directory** to: `backend`
   - Railway will use the Dockerfile in the backend directory

### Step 3: Configure Backend Environment Variables

In the Railway dashboard for your backend service:

1. Go to the **Variables** tab
2. Add the following environment variables:

```
FRONTEND_URL=https://your-frontend-domain.railway.app
HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token_here
CLOUDFLARE_EMAIL_API_TOKEN=your_cloudflare_email_token_here
EMAIL_VERIFICATION_SECRET=your_secret_key_here
PORT=8000
```

**Note**: Railway automatically sets `PORT`, but you can set it explicitly if needed. The `FRONTEND_URL` will be updated after you deploy the frontend.

### Step 4: Deploy the Frontend

1. In the same Railway project, click **"+ New"** → **"GitHub Repo"** (or **"Empty Service"**)
2. If using GitHub:
   - Select your repository
   - Set the **Root Directory** to: `frontend`
   - Railway will automatically detect the `railway.json` file
3. If using Empty Service:
   - Connect your GitHub repo or upload code
   - Set the **Root Directory** to: `frontend`

### Step 5: Configure Frontend Environment Variables

In the Railway dashboard for your frontend service:

1. Go to the **Variables** tab
2. Add the following environment variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
NEXT_PUBLIC_BETA=false
PORT=3000
```

**Important**: 
- Replace `your-backend-domain.railway.app` with your actual backend Railway domain
- You can find the domain in the backend service's **Settings** → **Networking** tab
- Railway automatically provides a domain, or you can add a custom domain

### Step 6: Update Backend FRONTEND_URL

After deploying the frontend, update the backend's `FRONTEND_URL` environment variable:

1. Go to your backend service in Railway
2. Navigate to **Variables** tab
3. Update `FRONTEND_URL` to match your frontend Railway domain

### Step 7: Generate Public URLs (Optional)

1. For each service, go to **Settings** → **Networking**
2. Click **"Generate Domain"** to get a public URL
3. Or add a custom domain if you have one

## Option 2: Deploy via Railway CLI

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate.

### Step 3: Initialize Railway Project

```bash
# In your project root
railway init
```

This will create a new Railway project or link to an existing one.

### Step 4: Deploy Backend

```bash
cd backend
railway link  # Link to your project (if not already linked)
railway up
```

### Step 5: Set Backend Environment Variables

```bash
# Set environment variables
railway variables set FRONTEND_URL=https://your-frontend-domain.railway.app
railway variables set HUBSPOT_ACCESS_TOKEN=your_token_here
railway variables set CLOUDFLARE_EMAIL_API_TOKEN=your_token_here
railway variables set EMAIL_VERIFICATION_SECRET=your_secret_here
```

Or use the dashboard to set variables (easier for sensitive data).

### Step 6: Deploy Frontend

```bash
cd ../frontend
railway link  # Link to the same project
railway up
```

### Step 7: Set Frontend Environment Variables

```bash
# Get your backend URL first (from Railway dashboard or: railway domain)
railway variables set NEXT_PUBLIC_API_URL=https://your-backend-domain.railway.app
railway variables set NEXT_PUBLIC_BETA=false
```

## Environment Variables Reference

### Backend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `FRONTEND_URL` | Yes | Frontend URL for CORS | `https://beat-finder.railway.app` |
| `HUBSPOT_ACCESS_TOKEN` | Yes | HubSpot API token | `pat-eu1-...` |
| `CLOUDFLARE_EMAIL_API_TOKEN` | Yes | Cloudflare email token | `...` |
| `EMAIL_VERIFICATION_SECRET` | Yes | Secret for email verification | `your-secret-key` |
| `PORT` | Auto | Port (set automatically by Railway) | `8000` |
| `MAX_FILE_SIZE_MB` | No | Max file size in MB (default: 1024) | `1024` |

### Frontend Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API URL | `https://beat-finder-api.railway.app` |
| `NEXT_PUBLIC_BETA` | No | Enable beta mode (default: false) | `false` |
| `PORT` | Auto | Port (set automatically by Railway) | `3000` |

## Post-Deployment Checklist

- [ ] Backend service is running and healthy
- [ ] Frontend service is running and healthy
- [ ] Backend `FRONTEND_URL` matches frontend domain
- [ ] Frontend `NEXT_PUBLIC_API_URL` matches backend domain
- [ ] All environment variables are set correctly
- [ ] Test the health endpoint: `https://your-backend.railway.app/health`
- [ ] Test the frontend: `https://your-frontend.railway.app`
- [ ] Test file upload and processing
- [ ] Test email verification flow
- [ ] Verify HubSpot integration is working

## Troubleshooting

### Backend Issues

**Service won't start:**
- Check logs in Railway dashboard
- Verify all required environment variables are set
- Ensure Dockerfile builds successfully
- Check that `PORT` is being used correctly (Railway sets this automatically)

**CORS errors:**
- Verify `FRONTEND_URL` matches your frontend domain exactly
- Check that the frontend URL doesn't have a trailing slash
- Ensure CORS middleware is configured correctly

**File upload fails:**
- Check available disk space (Railway has limits)
- Verify `MAX_FILE_SIZE_MB` is set appropriately
- Check logs for specific error messages

### Frontend Issues

**Build fails:**
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility (should be 20+)
- Check build logs for specific errors

**API calls fail:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly
- Check that the backend is running and accessible
- Verify CORS is configured on the backend

**Environment variables not working:**
- Remember: Only `NEXT_PUBLIC_*` variables are available in the browser
- Restart the service after changing environment variables
- Rebuild the service if needed

### General Issues

**Services can't communicate:**
- Use the Railway-provided domains, not localhost
- Ensure both services are in the same Railway project (for private networking)
- Check that environment variables reference the correct domains

**Domain not working:**
- Generate a domain in Settings → Networking
- Wait a few minutes for DNS propagation
- Check that the service is deployed and running

## Monitoring and Logs

- View logs in Railway dashboard: Click on service → **Deployments** → Click on a deployment → **View Logs**
- Use Railway CLI: `railway logs` (in service directory)
- Set up alerts in Railway dashboard for service failures

## Updating Your Deployment

### Via Dashboard
1. Push changes to your GitHub repository
2. Railway will automatically detect changes and redeploy
3. Or manually trigger a redeploy from the dashboard

### Via CLI
```bash
# In backend or frontend directory
railway up
```

## Cost Considerations

- Railway offers a free tier with usage limits
- Monitor your usage in the Railway dashboard
- Consider upgrading if you exceed free tier limits
- File storage and processing can consume resources

## Security Best Practices

1. **Never commit secrets**: Use Railway environment variables
2. **Use strong secrets**: Generate strong values for `EMAIL_VERIFICATION_SECRET`
3. **Rotate tokens**: Regularly rotate API tokens
4. **Monitor access**: Check Railway logs for suspicious activity
5. **Use custom domains**: Set up custom domains with SSL (Railway provides this automatically)

## Next Steps

After successful deployment:

1. Set up a custom domain (optional)
2. Configure monitoring and alerts
3. Set up CI/CD for automatic deployments
4. Configure backups if needed
5. Set up staging environment for testing

## Support

- Railway Documentation: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Project Issues: Open an issue in your repository

