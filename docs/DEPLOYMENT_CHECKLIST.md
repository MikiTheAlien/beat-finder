# Railway Deployment Checklist

Use this checklist when deploying to Railway for the first time or after major changes.

## Pre-Deployment

- [ ] All code is committed and pushed to your repository
- [ ] Environment variables are documented and ready
- [ ] HubSpot access token is generated and ready
- [ ] Cloudflare email API token is ready
- [ ] Email verification secret is generated (use a strong random string)

## Backend Deployment

- [ ] Railway project is created
- [ ] Backend service is added to the project
- [ ] Root directory is set to `backend`
- [ ] Railway detects `railway.json` or Dockerfile
- [ ] Environment variables are set:
  - [ ] `FRONTEND_URL` (will update after frontend deployment)
  - [ ] `HUBSPOT_ACCESS_TOKEN`
  - [ ] `CLOUDFLARE_EMAIL_API_TOKEN`
  - [ ] `EMAIL_VERIFICATION_SECRET`
- [ ] Service builds successfully
- [ ] Service starts and is healthy
- [ ] Backend domain is generated/configured
- [ ] Health check passes: `https://your-backend.railway.app/health`

## Frontend Deployment

- [ ] Frontend service is added to the same Railway project
- [ ] Root directory is set to `frontend`
- [ ] Railway detects `railway.json` or Dockerfile
- [ ] Environment variables are set:
- [ ] `NEXT_PUBLIC_API_URL` (set to `/api/v1` for same domain, or full URL)
- [ ] `NEXT_PUBLIC_BETA` (set to `false` for production)
- [ ] Service builds successfully
- [ ] Service starts and is healthy
- [ ] Frontend domain is generated/configured

## Post-Deployment Configuration

- [ ] Update backend `FRONTEND_URL` with frontend domain
- [ ] Verify CORS is working (check browser console)
- [ ] Test frontend loads correctly
- [ ] Test API connection from frontend

## Testing

- [ ] Frontend homepage loads
- [ ] File upload interface works
- [ ] Can upload an audio file
- [ ] Processing starts and completes
- [ ] Email verification code is sent
- [ ] Can verify email and download XML
- [ ] HubSpot contact is created (check HubSpot dashboard)
- [ ] Error handling works (test with invalid file, etc.)

## Monitoring

- [ ] Logs are accessible in Railway dashboard
- [ ] Services show as healthy
- [ ] No error messages in logs
- [ ] Resource usage is within limits

## Security

- [ ] All secrets are in environment variables (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] Custom domains have SSL (Railway provides automatically)
- [ ] CORS is configured correctly

## Documentation

- [ ] Deployment URLs are documented
- [ ] Environment variables are documented
- [ ] Team members have access to Railway project
- [ ] Deployment process is documented

## Troubleshooting Notes

If something doesn't work:

1. Check Railway logs for errors
2. Verify all environment variables are set correctly
3. Ensure domains are correct (no trailing slashes)
4. Check that services are in the same Railway project
5. Verify Docker builds work locally
6. Check Railway status page for outages

## Rollback Plan

If deployment fails:

1. Previous deployment should still be running
2. Can redeploy previous version from Railway dashboard
3. Can revert git commit and redeploy
4. Keep backup of working environment variables

