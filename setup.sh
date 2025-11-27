#!/bin/bash

# PopStruct Setup Script

echo "================================"
echo "PopStruct Setup Script"
echo "================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration before continuing."
    echo "Press Enter when ready to continue..."
    read
fi

# Start services
echo "Starting services with Docker Compose..."
docker-compose up -d db redis

echo "Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "Running database migrations..."
docker-compose run --rm backend alembic upgrade head

# Start all services
echo "Starting all services..."
docker-compose up -d

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
echo ""
echo "Services are now running:"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "To view logs: docker-compose logs -f"
echo "To stop services: docker-compose down"
echo ""
