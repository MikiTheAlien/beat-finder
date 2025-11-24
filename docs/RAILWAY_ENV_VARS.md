# Railway Environment Variables - Quick Reference

## Frontend Environment Variables

```bash
NEXT_PUBLIC_API_URL="/api/v1"
NEXT_PUBLIC_BETA="true"
```

**Explanation:**
- `NEXT_PUBLIC_API_URL="/api/v1"` - Relative path since frontend and API are on the same domain
- `NEXT_PUBLIC_BETA="true"` - Set to `"true"` for beta mode, `"false"` for production

**Alternative (if you prefer absolute URL):**
```bash
NEXT_PUBLIC_API_URL="https://beat-finder.undrstnd.ch/api/v1"
```

## Backend Environment Variables

```bash
FRONTEND_URL="https://beat-finder.undrstnd.ch"
HUBSPOT_ACCESS_TOKEN="your-hubspot-token-here"
CLOUDFLARE_EMAIL_API_TOKEN="your-cloudflare-token-here"
EMAIL_VERIFICATION_SECRET="your-secret-key-here"
```

**Explanation:**
- `FRONTEND_URL` - Used for CORS configuration, must include `https://`
- `HUBSPOT_ACCESS_TOKEN` - Your HubSpot API token (required for lead collection)
- `CLOUDFLARE_EMAIL_API_TOKEN` - Your Cloudflare email token (required for email verification)
- `EMAIL_VERIFICATION_SECRET` - A strong random string for email verification security

## Quick Setup in Railway

### Frontend Service
1. Go to Railway Dashboard → Frontend Service → Variables
2. Add/Update:
   - `NEXT_PUBLIC_API_URL` = `/api/v1`
   - `NEXT_PUBLIC_BETA` = `true`

### Backend Service
1. Go to Railway Dashboard → Backend Service → Variables
2. Add/Update:
   - `FRONTEND_URL` = `https://beat-finder.undrstnd.ch`
   - `HUBSPOT_ACCESS_TOKEN` = `your-hubspot-token`
   - `CLOUDFLARE_EMAIL_API_TOKEN` = `your-cloudflare-token`
   - `EMAIL_VERIFICATION_SECRET` = `generate-a-strong-random-string`

## Notes

- ✅ Use relative path `/api/v1` for frontend (recommended) - works automatically with same domain
- ✅ Or use absolute URL `https://beat-finder.undrstnd.ch/api/v1` if you prefer
- ✅ Backend `FRONTEND_URL` must be absolute with `https://` for CORS
- ⚠️ Make sure `HUBSPOT_ACCESS_TOKEN` and `CLOUDFLARE_EMAIL_API_TOKEN` are set correctly (not swapped!)
- ⚠️ `EMAIL_VERIFICATION_SECRET` should be a strong random string, not empty

## API Endpoints

All API endpoints are now under `/api/v1/`:

- `POST /api/v1/upload` - Upload audio file
- `GET /api/v1/process/{job_id}/status` - Check status
- `POST /api/v1/verify-email` - Send verification code
- `POST /api/v1/verify-code` - Verify code
- `GET /api/v1/download/{job_id}` - Download XML
- `POST /api/v1/beta-signup` - Beta signup
- `GET /health` - Health check (no prefix)

