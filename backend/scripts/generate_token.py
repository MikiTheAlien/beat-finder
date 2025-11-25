#!/usr/bin/env python3
"""
Generate a JWT API token for frontend authentication.

Usage:
    python3 scripts/generate_token.py [--expires-days DAYS] [--secret SECRET]

Example:
    python3 scripts/generate_token.py --expires-days 365
    python3 scripts/generate_token.py --secret "your-secret-here"
"""
import sys
import os
import argparse
from datetime import datetime, timedelta

# Try to use backend modules if available, otherwise use standalone implementation
try:
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
    from backend.utils.jwt import create_api_token
    from backend.config import settings
    USE_BACKEND_MODULES = True
except ImportError:
    USE_BACKEND_MODULES = False
    try:
        import jwt
    except ImportError:
        print("Error: Either backend dependencies or PyJWT must be installed.")
        print("Install with: pip install PyJWT")
        print("Or run from within the backend Docker container.")
        sys.exit(1)


def create_token_standalone(secret: str, expires_days: int = 365) -> str:
    """Standalone token creation using PyJWT."""
    payload = {
        "type": "api_token",
        "exp": datetime.utcnow() + timedelta(days=expires_days),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, secret, algorithm="HS256")


def main():
    parser = argparse.ArgumentParser(description='Generate JWT API token for frontend')
    parser.add_argument(
        '--expires-days',
        type=int,
        default=365,
        help='Number of days until token expires (default: 365)'
    )
    parser.add_argument(
        '--secret',
        type=str,
        default=None,
        help='JWT secret (if not provided, uses JWT_SECRET env var or backend config)'
    )
    args = parser.parse_args()
    
    # Get JWT secret
    if args.secret:
        jwt_secret = args.secret
    elif USE_BACKEND_MODULES:
        jwt_secret = settings.jwt_secret
        if jwt_secret == "changeme-in-production":
            print("WARNING: JWT_SECRET is set to default value!")
            print("Set JWT_SECRET environment variable or use --secret flag.")
            print("Example: export JWT_SECRET=$(openssl rand -hex 32)")
            sys.exit(1)
    else:
        jwt_secret = os.getenv('JWT_SECRET')
        if not jwt_secret:
            print("Error: JWT_SECRET not set!")
            print("Set JWT_SECRET environment variable or use --secret flag.")
            print("Example: export JWT_SECRET=$(openssl rand -hex 32)")
            sys.exit(1)
    
    try:
        if USE_BACKEND_MODULES:
            token = create_api_token(expires_days=args.expires_days)
        else:
            token = create_token_standalone(jwt_secret, args.expires_days)
        
        print(f"\nAPI Token (expires in {args.expires_days} days):")
        print(f"{token}\n")
        print("Set this as NEXT_PUBLIC_API_TOKEN in your frontend environment variables.")
    except Exception as e:
        print(f"Error generating token: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

