#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Function to check a service
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

# Check if Docker services are running
echo "Checking Docker services..."
if ! docker-compose ps --services --filter "status=running" | grep -q "."; then
    echo -e "${RED}Docker services are not running${NC}"
    echo "Please start services with: docker-compose up -d"
    exit 1
fi

# Give services a moment to fully initialize
sleep 5

# Check backend health
check_service "Backend health endpoint" "http://localhost:5000/health"
backend_status=$?

# Check frontend
check_service "Frontend" "http://localhost:3000"
frontend_status=$?

# Check node_modules permissions
echo -n "Checking node_modules permissions... "
if docker-compose exec -T backend ls -l /app/node_modules >/dev/null 2>&1; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "Fix with: docker-compose exec backend chmod -R 755 /app/node_modules"
fi

# Overall status
if [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo -e "\n${GREEN}All services are running correctly${NC}"
    exit 0
else
    echo -e "\n${RED}Some services are not running correctly${NC}"
    echo "Check the logs with: docker-compose logs -f"
    exit 1
fi
