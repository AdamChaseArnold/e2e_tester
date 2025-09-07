#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting E2E Tester application locally...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js to run this application.${NC}"
    exit 1
fi

# Kill any existing processes on ports 3000 and 5001
echo -e "${YELLOW}Checking for existing processes on ports 3000 and 5001...${NC}"
fuser -k 3000/tcp &>/dev/null || true
fuser -k 5001/tcp &>/dev/null || true
echo -e "${GREEN}Ports cleared.${NC}"

# Start backend in background
echo -e "${YELLOW}Starting backend on http://localhost:5001${NC}"
cd "$(dirname "$0")/backend"
PORT=5001 node server.js &
BACKEND_PID=$!

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to start...${NC}"
sleep 3

# Check if backend is running
if ! curl -s http://localhost:5001/health &>/dev/null; then
    echo -e "${RED}Backend failed to start. Check logs for errors.${NC}"
    kill $BACKEND_PID &>/dev/null || true
    exit 1
fi
echo -e "${GREEN}Backend started successfully!${NC}"

# Start frontend
echo -e "${YELLOW}Starting frontend on http://localhost:3000${NC}"
cd "$(dirname "$0")/frontend"
npm start

# Cleanup on exit
trap "kill $BACKEND_PID &>/dev/null || true" EXIT
