#!/bin/bash
set -e

# Run migrations or setup if needed
# Add any pre-start commands here

# Start the application
exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

