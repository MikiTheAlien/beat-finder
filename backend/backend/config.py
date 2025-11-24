from pydantic_settings import BaseSettings
from pydantic import field_validator, Field
from typing import Optional
import os


class Settings(BaseSettings):
    # Server
    # Railway sets PORT env var, Pydantic will read it automatically (case_sensitive=False)
    port: int = Field(default=8000, description="Server port (reads from PORT env var)")
    frontend_url: str = "http://localhost:3000"
    
    def __init__(self, **kwargs):
        # Read PORT from environment if available (Railway sets this)
        if 'port' not in kwargs and 'PORT' not in kwargs:
            port_env = os.getenv('PORT')
            if port_env:
                try:
                    kwargs['port'] = int(port_env)
                except ValueError:
                    pass
        super().__init__(**kwargs)
    
    # HubSpot
    # Access Token from Private App (recommended) or Personal Access Key
    # Private App: Settings > Integrations > Private Apps (create app, get access token)
    # Personal Access Key: Settings > Development > Personal Access Key
    hubspot_access_token: Optional[str] = None
    
    @field_validator('hubspot_access_token', mode='before')
    @classmethod
    def empty_str_to_none(cls, v):
        """Convert empty strings to None for optional fields"""
        if v == "":
            return None
        return v
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

