"""
JWT token utilities for API authentication.
Supports API tokens (for frontend) and can be extended for user tokens.
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import jwt, JWTError
import logging

from backend.config import settings

logger = logging.getLogger(__name__)


def create_api_token(expires_days: int = 365) -> str:
    """
    Create a long-lived API token for frontend authentication.
    
    Args:
        expires_days: Number of days until token expires (default: 365)
        
    Returns:
        JWT token string
    """
    payload = {
        "type": "api_token",
        "exp": datetime.utcnow() + timedelta(days=expires_days),
        "iat": datetime.utcnow(),
    }
    
    token = jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )
    
    return token


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token string
        
    Returns:
        Decoded token payload if valid, None otherwise
    """
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[settings.jwt_algorithm]
        )
        return payload
    except JWTError as e:
        logger.warning(f"JWT verification failed: {str(e)}")
        return None


def get_token_from_header(authorization: Optional[str]) -> Optional[str]:
    """
    Extract JWT token from Authorization header.
    Expected format: "Bearer <token>"
    
    Args:
        authorization: Authorization header value
        
    Returns:
        Token string if found, None otherwise
    """
    if not authorization:
        return None
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None
    
    return parts[1]


def is_api_token(payload: Dict[str, Any]) -> bool:
    """
    Check if token payload is an API token.
    
    Args:
        payload: Decoded JWT payload
        
    Returns:
        True if token type is api_token
    """
    return payload.get("type") == "api_token"


def is_user_token(payload: Dict[str, Any]) -> bool:
    """
    Check if token payload is a user token.
    For future expansion when user authentication is added.
    
    Args:
        payload: Decoded JWT payload
        
    Returns:
        True if token type is user_token
    """
    return payload.get("type") == "user_token"

