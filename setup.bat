@echo off
REM PopStruct Setup Script for Windows

echo ================================
echo PopStruct Setup Script
echo ================================
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not installed. Please install Docker Desktop first.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo Please edit .env file with your configuration before continuing.
    echo Press any key when ready to continue...
    pause
)

REM Start services
echo Starting services with Docker Compose...
docker-compose up -d db redis

echo Waiting for database to be ready...
timeout /t 10 /nobreak

REM Run database migrations
echo Running database migrations...
docker-compose run --rm backend alembic upgrade head

REM Start all services
echo Starting all services...
docker-compose up -d

echo.
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Services are now running:
echo   - Frontend: http://localhost:3000
echo   - Backend API: http://localhost:8000
echo   - API Docs: http://localhost:8000/docs
echo.
echo To view logs: docker-compose logs -f
echo To stop services: docker-compose down
echo.
pause
