#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E2E Tester Frontend locally...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run this application.${NC}"
    exit 1
fi

# Kill any existing processes on port 3000
echo -e "${YELLOW}Checking for existing processes on port 3000...${NC}"
fuser -k 3000/tcp &>/dev/null || true
echo -e "${GREEN}Port cleared.${NC}"

# Navigate to frontend directory
cd "$(dirname "$0")/frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing frontend dependencies...${NC}"
    npm install
fi

# Start frontend
echo -e "${GREEN}Starting frontend on http://localhost:3000${NC}"
echo -e "${YELLOW}Note: Make sure the backend is running on port 5001${NC}"
npm start
