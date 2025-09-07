#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E2E Tester Backend locally...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run this application.${NC}"
    exit 1
fi

# Kill any existing processes on port 5001
echo -e "${YELLOW}Checking for existing processes on port 5001...${NC}"
fuser -k 5001/tcp &>/dev/null || true
echo -e "${GREEN}Port cleared.${NC}"

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing backend dependencies...${NC}"
    npm install
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Creating default .env file...${NC}"
    echo "PORT=5001" > .env
fi

# Start backend
echo -e "${GREEN}Starting backend on http://localhost:5001${NC}"
PORT=5001 node server.js
