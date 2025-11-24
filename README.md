# Beat Finder by UNDRSTND

Transform your audio into precise video editing markers. Upload your audio file and get Final Cut Pro XML markers for beats, drops, and song transitions.

## Features

- **Beat Drop Detection**: Automatically detect beat drops and energy changes in your audio
- **Build-Up Detection**: Identify build-ups and transitions for seamless video editing
- **BPM Markers**: Get BPM markers throughout your track for precise timing
- **Song Boundaries**: Detect song beginnings and endings automatically
- **Silence Detection**: Find gaps and silence regions in your audio
- **Final Cut Pro Ready**: Export directly to FCPXML format for instant import
- **Multilingual**: Available in English and German

## Prerequisites

- Docker and Docker Compose (for local development)
- Node.js 20+ (for CLI usage or local frontend development)
- Python 3.11+ (for CLI usage or local backend development)

## Quick Start

### Using Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd beat-finder
   ```

2. **Start the application**:
   ```bash
   ./start.sh
   ```
   
   Or manually:
   ```bash
   docker-compose up
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

The application will automatically open in your default browser.

### Local Development

#### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set environment variables** (create `.env` file):
   ```env
   PORT=8000
   FRONTEND_URL=http://localhost:3000
   HUBSPOT_ACCESS_TOKEN=your_hubspot_access_token
   CLOUDFLARE_EMAIL_API_TOKEN=your_cloudflare_token
   EMAIL_VERIFICATION_SECRET=your_secret_key
   ```

5. **Run the backend**:
   ```bash
   uvicorn main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set environment variables** (create `.env.local` file):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Run the frontend**:
   ```bash
   npm run dev
   ```

## CLI Usage

Process audio files directly from the command line without email verification:

```bash
cd backend
python -m backend.cli.process_audio --file path/to/audio.wav --markers beat-drop,bpm
```

### CLI Options

- `--file`: Path to audio file (required)
- `--markers`: Comma-separated list of markers to detect
  - Available markers: `beat-drop`, `beat-build-up`, `bpm`, `song-beginning`, `silence`
  - If not specified, all markers will be detected
- `--output`: Output XML file path (optional, defaults to input filename with `.fcpxml` extension)

### Examples

```bash
# Process with all markers
python -m backend.cli.process_audio --file my-audio.wav

# Process with specific markers
python -m backend.cli.process_audio --file my-audio.wav --markers beat-drop,bpm

# Specify output file
python -m backend.cli.process_audio --file my-audio.wav --output markers.fcpxml
```

## How to Use

### Web Interface

1. **Export Audio from Final Cut Pro**:
   - Select your video project
   - Go to File > Share > Master File
   - Choose "Audio Only" format
   - Export as WAV, AIFF, or MP3

2. **Upload Audio**:
   - Drag and drop your audio file or click to browse
   - Maximum file size: 150MB
   - Supported formats: WAV, MP3, AIFF, M4A, FLAC

3. **Select Markers**:
   - Choose which markers you want to detect
   - Options: Beat Drop, Build-Up, BPM, Song Boundaries, Silence

4. **Process**:
   - Click "Upload & Process"
   - Wait for processing to complete

5. **Download**:
   - Enter your email address
   - Verify with the code sent to your email
   - Download the XML file

6. **Import to Final Cut Pro**:
   - File > Import > XML...
   - Select the downloaded `.fcpxml` file
   - Markers will appear in your timeline

## Deployment

### Railway Deployment

For detailed Railway deployment instructions, see **[docs/RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md)**.

**Quick Start:**

1. **Install Railway CLI** (optional):
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Deploy via Dashboard** (recommended):
   - Go to [railway.app](https://railway.app)
   - Create a new project
   - Add two services: one for `backend/` and one for `frontend/`
   - Set environment variables (see [docs/RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md) for details)

3. **Or deploy via CLI**:
   ```bash
   # Deploy backend
   cd backend
   railway link
   railway up

   # Deploy frontend
   cd ../frontend
   railway link
   railway up
   ```

**Required Environment Variables:**
- Backend: `FRONTEND_URL`, `HUBSPOT_ACCESS_TOKEN`, `CLOUDFLARE_EMAIL_API_TOKEN`, `EMAIL_VERIFICATION_SECRET`
- Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_BETA` (optional)

See [docs/RAILWAY_DEPLOYMENT.md](./docs/RAILWAY_DEPLOYMENT.md) for complete setup instructions, troubleshooting, and best practices.

### Environment Variables

#### Backend

- `PORT`: Server port (default: 8000)
- `FRONTEND_URL`: Frontend URL for CORS
- `HUBSPOT_ACCESS_TOKEN`: HubSpot Access Token (from Private App or Personal Access Key with write permissions)
- `CLOUDFLARE_EMAIL_API_TOKEN`: Cloudflare email API token
- `EMAIL_VERIFICATION_SECRET`: Secret for email verification
- `MAX_FILE_SIZE_MB`: Maximum file size in MB (default: 150)

#### Frontend

- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_BETA`: Enable beta mode (`true` or `false`). When enabled, shows email signup form instead of full audio processing interface

## HubSpot Integration

The application integrates with HubSpot CRM to collect leads. When users sign up (either through beta signup or after processing audio), their email addresses are automatically stored in HubSpot.

### Setting Up HubSpot

To create contacts in HubSpot CRM, you need an access token. You can get this by creating a **Private App** (recommended) or using a **Personal Access Key** with write permissions.

#### Option 1: Create a Private App (Recommended)

1. **Log in to HubSpot**:
   - Go to [hubspot.com](https://www.hubspot.com) and log in to your account

2. **Navigate to Private Apps**:
   - Click the **Settings** icon (gear icon) in the top right
   - In the left sidebar, go to **Integrations** > **Private Apps**
   - If you don't see "Private Apps", it may be under **Integrations** > **Developer** > **Private Apps**

3. **Create a New Private App**:
   - Click **Create a private app**
   - Give it a name (e.g., "Beat Finder Integration")
   - Go to the **Scopes** tab

4. **Configure Permissions**:
   - Under **CRM**, enable:
     - `crm.objects.contacts.read` (required for searching contacts)
     - `crm.objects.contacts.write` (required for creating/updating contacts)
     - `crm.schemas.contacts.read` (required for reading contact schemas)
   - Click **Create app**

5. **Copy the Access Token**:
   - After creating the app, you'll see an **Access Token**
   - Click **Show** to reveal the token
   - Click **Copy** to copy it
   - **Important**: Save this token securely - you won't be able to see it again

#### Option 2: Use Personal Access Key (If Private Apps Not Available)

1. **Log in to HubSpot**:
   - Go to [hubspot.com](https://www.hubspot.com) and log in to your account

2. **Navigate to Personal Access Key Settings**:
   - Click the **Settings** icon (gear icon) in the top right
   - In the left sidebar, go to **Development** > **Personal Access Key**
   - If you don't see "Development", it may be under **Integrations** > **Development**

3. **Generate a Personal Access Key**:
   - Click **Generate personal access key** (or **Show** if you already have one)
   - **Important**: You can only have one Personal Access Key per account
   - If you already have a key, you'll need to deactivate it first to create a new one

4. **Configure Permissions**:
   - In the **Permissions** section, ensure the following are checked:
     - **CRM Objects**: This must include write permissions (not just read)
   - **Note**: Personal Access Keys may have limited permissions depending on your HubSpot plan. If you only see read permissions, you may need to upgrade your HubSpot plan or use a Private App instead

5. **Copy the Personal Access Key**:
   - Click **Show** to reveal the key
   - Click **Copy** to copy it to your clipboard
   - **Important**: Save this key securely - you won't be able to see it again after closing the page

#### Setting the Environment Variable

After obtaining your Access Token (from Private App or Personal Access Key):

**For Local Development:**
- Create a `.env` file in the project root (or add to existing `.env`):
  ```env
  HUBSPOT_ACCESS_TOKEN=your_access_token_here
  ```
- Or update `docker-compose.yml` directly (line 11)

**For Railway Deployment:**
- In Railway Dashboard, go to your backend service
- Navigate to **Variables** tab
- Add a new variable:
  - **Name**: `HUBSPOT_ACCESS_TOKEN`
  - **Value**: Paste the Access Token you copied (from Private App or Personal Access Key)
- Save the variable

#### Verify Integration

- The application will automatically use HubSpot when `HUBSPOT_ACCESS_TOKEN` is set
- Restart your backend: `docker-compose restart backend`
- Test by submitting a beta signup or processing an audio file
- Check your HubSpot contacts to verify leads are being collected
- Check backend logs for any authentication errors

### Troubleshooting

- **401 Unauthorized Error**: Your Access Token may not have write permissions, or the token may be expired/invalid. Make sure you selected `crm.objects.contacts.write` scope
- **403 Forbidden Error**: Your Access Token is missing required scopes. Make sure you enabled:
  - `crm.objects.contacts.read` (required for searching contacts)
  - `crm.objects.contacts.write` (required for creating/updating contacts)
  - `crm.schemas.contacts.read` (required for reading contact schemas)
- **400 Bad Request - Properties Don't Exist**: The code now only uses standard properties (email). If you want to use custom properties, you need to create them in HubSpot first: Settings > Properties > Contact Properties
- **No Write Permissions**: Personal Access Keys on some HubSpot plans only support read operations. Use a Private App instead, which always supports write permissions
- **Key Not Found**: Make sure the environment variable is set correctly and the backend service has been restarted after setting it
- **Private Apps Not Available**: If you don't see "Private Apps" in your HubSpot account, you may need to upgrade your plan, or use a Personal Access Key with write permissions

### HubSpot Contact Properties

The application currently stores only the email address for each lead. This uses the standard `email` property that exists in all HubSpot accounts.

**Note**: 
- If a contact with the same email already exists, the contact will be updated rather than creating a duplicate
- To add custom properties (like lead source, markers, etc.), you need to create them in HubSpot first: **Settings > Properties > Contact Properties > Create property**
- Access Tokens require write permissions to create/update contacts. If you only have read permissions, contacts will not be stored

## Project Structure

```
beat-finder/
├── backend/              # Python FastAPI backend
│   ├── backend/
│   │   ├── routers/      # API routes
│   │   ├── services/     # Business logic
│   │   ├── models/       # Pydantic models
│   │   ├── utils/        # Utilities
│   │   └── cli/          # CLI tool
│   ├── main.py           # FastAPI app entry point
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Docker configuration
├── frontend/             # Next.js frontend
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── messages/         # i18n translations
│   └── package.json      # Node dependencies
├── docker-compose.yml    # Docker Compose configuration
└── README.md            # This file
```

## API Endpoints

- `POST /api/upload` - Upload audio file
- `GET /api/process/{job_id}/status` - Check processing status
- `POST /api/verify-email` - Send verification code
- `POST /api/verify-code` - Verify email code
- `GET /api/download/{job_id}` - Download XML file
- `GET /health` - Health check

See `/docs` for interactive API documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source. Please check the LICENSE file for details.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- Frontend powered by [Next.js](https://nextjs.org/)
- Audio processing using [madmom](https://madmom.readthedocs.io/) and [librosa](https://librosa.org/)
- Deployed on [Railway](https://railway.app/)

---

Made with ❤️ by [UNDRSTND](https://www.undrstnd.ch/)
