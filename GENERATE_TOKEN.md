# Generate API Token

## JWT Secret

The JWT secret has been generated and set in `docker-compose.yml`:

```
JWT_SECRET=e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf
```

## Generate API Token

### Option 1: Using Node.js (Recommended - No Dependencies)

```bash
cd backend
node scripts/generate_token.js --secret "e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf"
```

Or set the environment variable:
```bash
cd backend
export JWT_SECRET="e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf"
node scripts/generate_token.js
```

### Option 2: Using Docker (Python Script)

Once the backend container is running:

```bash
docker exec -it beat-finder-backend python3 scripts/generate_token.py
```

### Option 3: Using Local Python Environment

If you have the backend dependencies installed locally:

```bash
cd backend
export JWT_SECRET="e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf"
python3 scripts/generate_token.py --secret "e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf"
```

## Set the Token

After generating the token, set it in your environment:

### For Docker Compose

Add to your `.env` file or export:
```bash
export NEXT_PUBLIC_API_TOKEN="your-generated-token-here"
```

Then restart the frontend container:
```bash
docker-compose restart frontend
```

### For Railway

Set in Railway Dashboard → Frontend Service → Variables:
```
NEXT_PUBLIC_API_TOKEN=your-generated-token-here
```

And for Backend:
```
JWT_SECRET=e6809826e54e7021c8c5661704694b483420b96a38ff4cba652113e7747b94cf
```

