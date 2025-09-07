#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking local services...${NC}"

# Function to check if a service is running on a port
check_port() {
    local name=$1
    local port=$2
    echo -n "Checking $name on port $port... "
    
    if nc -z localhost $port; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC}"
        return 1
    fi
}

# Function to check HTTP status of a service
check_service() {
    local name=$1
    local url=$2
    echo -n "Checking $name... "
    
    response=$(curl -s -o /dev/null -w "%{http_code}" $url)
    
    if [ $response -eq 200 ]; then
        echo -e "${GREEN}OK${NC}"
        return 0
    else
        echo -e "${RED}FAILED${NC} (HTTP $response)"
        return 1
    fi
}

# Check if backend is running
if ! check_port "Backend" 5001; then
    echo -e "${RED}Backend service is not running on port 5001${NC}"
    echo -e "${YELLOW}Start the backend with: cd backend && npm start${NC}"
    exit 1
fi

# Check if frontend is running
if ! check_port "Frontend" 3000; then
    echo -e "${RED}Frontend service is not running on port 3000${NC}"
    echo -e "${YELLOW}Start the frontend with: cd frontend && npm start${NC}"
    exit 1
fi

# Check backend health endpoint
if ! check_service "Backend health endpoint" "http://localhost:5001/health"; then
    echo -e "${RED}Backend health check failed${NC}"
    exit 1
fi

# Check frontend accessibility
if ! check_service "Frontend accessibility" "http://localhost:3000"; then
    echo -e "${RED}Frontend accessibility check failed${NC}"
    exit 1
fi

echo -e "${GREEN}All services are running correctly!${NC}"
exit 0
