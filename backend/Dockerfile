FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for audio processing
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Cython first (required for madmom)
RUN pip install --no-cache-dir Cython numpy

# Copy requirements first for better caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create directories for uploads and processed files
RUN mkdir -p /app/uploads /app/processed

# Expose port (Railway will set PORT env var at runtime)
# EXPOSE is just documentation - Railway uses the PORT env var
EXPOSE 8000

# Run the application using shell form to expand PORT env var
# Railway sets PORT env var, defaults to 8000 if not set
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}

