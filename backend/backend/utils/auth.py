"""
FastAPI authentication dependencies.
Provides dependencies for verifying API tokens and user tokens.
"""
from fastapi import HTTPException, Depends, Header
from typing import Optional, Dict, Any
import logging

from backend.utils.jwt import verify_token, get_token_from_header, is_api_token, is_user_token

logger = logging.getLogger(__name__)


async def verify_api_token(
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    FastAPI dependency to verify API token from Authorization header.
    
    Args:
        authorization: Authorization header value (Bearer <token>)
        
    Returns:
        Decoded token payload
        
    Raises:
        HTTPException(401): If token is missing or invalid
    """
    if not authorization:
        logger.warning("API request missing Authorization header")
        raise HTTPException(
            status_code=401,
            detail="Missing authorization token"
        )
    
    token = get_token_from_header(authorization)
    if not token:
        logger.warning("Invalid Authorization header format")
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )
    
    payload = verify_token(token)
    if not payload:
        logger.warning("Invalid or expired token")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    # Verify this is an API token (not a user token)
    if not is_api_token(payload):
        logger.warning("Token is not an API token")
        raise HTTPException(
            status_code=401,
            detail="Invalid token type"
        )
    
    return payload


async def verify_user_token(
    authorization: Optional[str] = Header(None)
) -> Dict[str, Any]:
    """
    FastAPI dependency to verify user token from Authorization header.
    For future expansion when user authentication is added.
    
    Args:
        authorization: Authorization header value (Bearer <token>)
        
    Returns:
        Decoded token payload with user information
        
    Raises:
        HTTPException(401): If token is missing or invalid
    """
    if not authorization:
        logger.warning("User request missing Authorization header")
        raise HTTPException(
            status_code=401,
            detail="Missing authorization token"
        )
    
    token = get_token_from_header(authorization)
    if not token:
        logger.warning("Invalid Authorization header format")
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected: Bearer <token>"
        )
    
    payload = verify_token(token)
    if not payload:
        logger.warning("Invalid or expired user token")
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    
    # Verify this is a user token
    if not is_user_token(payload):
        logger.warning("Token is not a user token")
        raise HTTPException(
            status_code=401,
            detail="Invalid token type"
        )
    
    return payload

