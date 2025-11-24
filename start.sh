#!/bin/bash

# Start script for Beat Finder
# This script starts Docker containers and opens the browser

echo "🚀 Starting Beat Finder..."
echo ""

# Start Docker containers
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "beat-finder-frontend.*Up"; then
    echo "✅ Frontend is running"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

if docker-compose ps | grep -q "beat-finder-backend.*Up"; then
    echo "✅ Backend is running"
else
    echo "❌ Backend failed to start"
    exit 1
fi

echo ""
echo "🌐 Opening browser..."
echo ""

# Open browser (works on macOS, Linux, and Windows with WSL)
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 in your browser"
else
    echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo "✅ Beat Finder is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo ""
echo "To stop the services, run: docker-compose down"

