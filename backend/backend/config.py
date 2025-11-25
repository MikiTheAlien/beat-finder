from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from typing import Optional
import os
import logging


class Settings(BaseSettings):
    # Server
    # Railway sets PORT env var, Pydantic will read it automatically (case_sensitive=False)
    port: int = Field(default=8000, description="Server port (reads from PORT env var)")
    frontend_url: str = "http://localhost:3000"
    
    # HubSpot
    # Access Token from Private App (recommended) or Personal Access Key
    # Private App: Settings > Integrations > Private Apps (create app, get access token)
    # Personal Access Key: Settings > Development > Personal Access Key
    hubspot_access_token: Optional[str] = None
    
    # JWT Authentication
    jwt_secret: str = "changeme-in-production"
    jwt_algorithm: str = "HS256"
    
    class Config:
        env_file = ".env"
        case_sensitive = False
    
    def __init__(self, **kwargs):
        # Read PORT from environment if available (Railway sets this)
        # Pydantic Settings should handle this automatically, but we ensure it works
        if 'port' not in kwargs:
            port_env = os.getenv('PORT')
            if port_env:
                try:
                    kwargs['port'] = int(port_env)
                except (ValueError, TypeError):
                    pass
        super().__init__(**kwargs)
    
    @field_validator('hubspot_access_token', mode='before')
    @classmethod
    def empty_str_to_none(cls, v):
        """Convert empty strings to None for optional fields"""
        if v == "":
            return None
        return v
    
    @field_validator('jwt_secret', mode='after')
    @classmethod
    def validate_jwt_secret(cls, v):
        """Warn if JWT secret is not changed from default"""
        # Only warn in production (when RAILWAY_ENVIRONMENT is set)
        # Use try/except to avoid issues if logging isn't configured yet
        if v == "changeme-in-production" and os.getenv("RAILWAY_ENVIRONMENT"):
            try:
                logger = logging.getLogger(__name__)
                logger.warning("JWT_SECRET is set to default value! This is insecure in production.")
            except Exception:
                # If logging fails, just continue - this is just a warning
                pass
        return v


settings = Settings()

