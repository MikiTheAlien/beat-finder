from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import settings
from backend.routers import email
from backend.utils.logger import setup_logging

# Set up structured logging
logger = setup_logging(level="INFO")

app = FastAPI(
    title="Beat Finder API",
    description="API for Beat Finder by UNDRSTND",
    version="1.0.0"
)

logger.info("Beat Finder API starting up...")

# Normalize frontend URL for CORS (add protocol if missing)
def normalize_url(url: str) -> str:
    """Add https:// protocol if URL doesn't have a protocol."""
    if not url:
        return url
    url = url.strip()
    if not url.startswith(('http://', 'https://')):
        return f"https://{url}"
    return url

frontend_url_normalized = normalize_url(settings.frontend_url)
cors_origins = [frontend_url_normalized, "http://localhost:3000", "https://localhost:3000"]
# Also add without protocol version for flexibility
if settings.frontend_url and not settings.frontend_url.startswith(('http://', 'https://')):
    cors_origins.append(f"http://{settings.frontend_url}")

logger.info(f"CORS allowed origins: {cors_origins}")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with versioned API path
app.include_router(email.router, prefix="/api/v1", tags=["email"])

logger.info("Routers registered successfully")


@app.get("/health")
async def health_check():
    logger.debug("Health check requested")
    return {"status": "healthy"}


@app.get("/")
async def root():
    return {"message": "Beat Finder API", "version": "1.0.0"}


if __name__ == "__main__":
    import uvicorn
    logger.info(f"Starting server on 0.0.0.0:{settings.port}")
    uvicorn.run(app, host="0.0.0.0", port=settings.port)

