#!/bin/bash

# PopStruct Deployment Health Check
# Usage: ./check-deployment.sh <backend-url> <frontend-url>

BACKEND_URL=${1:-http://localhost:8000}
FRONTEND_URL=${2:-http://localhost:3000}

echo "================================"
echo "PopStruct Deployment Check"
echo "================================"
echo ""
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check backend health
echo "Checking backend..."
BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/health" 2>/dev/null)

if [ "$BACKEND_HEALTH" = "200" ]; then
    echo -e "${GREEN}✓${NC} Backend is healthy (HTTP 200)"
else
    echo -e "${RED}✗${NC} Backend health check failed (HTTP $BACKEND_HEALTH)"
    echo "  Make sure backend is running and accessible"
fi

# Check backend API docs
echo "Checking API documentation..."
DOCS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/docs" 2>/dev/null)

if [ "$DOCS_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} API docs accessible at $BACKEND_URL/docs"
else
    echo -e "${YELLOW}⚠${NC} API docs not accessible (HTTP $DOCS_STATUS)"
fi

# Check frontend
echo "Checking frontend..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" 2>/dev/null)

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} Frontend is accessible (HTTP 200)"
else
    echo -e "${RED}✗${NC} Frontend check failed (HTTP $FRONTEND_STATUS)"
    echo "  Make sure frontend is running and accessible"
fi

# Check database connection (if backend is running)
if [ "$BACKEND_HEALTH" = "200" ]; then
    echo "Checking database connection..."
    # Try to access an endpoint that requires database
    DB_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/v1/auth/signup" -X POST -H "Content-Type: application/json" -d '{}' 2>/dev/null)

    if [ "$DB_CHECK" = "422" ] || [ "$DB_CHECK" = "400" ]; then
        # 422 means validation error, which means API is working
        echo -e "${GREEN}✓${NC} Database connection working"
    else
        echo -e "${YELLOW}⚠${NC} Database connection may have issues (HTTP $DB_CHECK)"
    fi
fi

echo ""
echo "================================"
echo "Summary"
echo "================================"

if [ "$BACKEND_HEALTH" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Deployment is healthy!${NC}"
    echo ""
    echo "Access your app:"
    echo "  Frontend: $FRONTEND_URL"
    echo "  Backend API: $BACKEND_URL"
    echo "  API Docs: $BACKEND_URL/docs"
    echo ""
    echo "Next steps:"
    echo "  1. Sign up at $FRONTEND_URL/signup"
    echo "  2. Upload a dataset"
    echo "  3. Run an analysis"
    exit 0
else
    echo -e "${RED}✗ Deployment has issues${NC}"
    echo ""
    echo "Troubleshooting:"
    echo "  - Check service logs"
    echo "  - Verify environment variables"
    echo "  - Ensure all services are running"
    echo "  - Check FREE_DEPLOYMENT.md for setup guide"
    exit 1
fi
