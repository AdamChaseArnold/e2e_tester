#!/bin/bash

# Script to shutdown server instances for the e2e_tester application

echo "Shutting down server instances..."

# Find and kill Node.js processes running on port 3001 (Express server)
PORT_3001_PID=$(lsof -t -i:3001)
if [ -n "$PORT_3001_PID" ]; then
  echo "Killing process on port 3001 (PID: $PORT_3001_PID)"
  kill -9 $PORT_3001_PID
  echo "✅ Process on port 3001 terminated"
else
  echo "No process found running on port 3001"
fi

# Find and kill Node.js processes running on port 3000 (React dev server)
PORT_3000_PID=$(lsof -t -i:3000)
if [ -n "$PORT_3000_PID" ]; then
  echo "Killing process on port 3000 (PID: $PORT_3000_PID)"
  kill -9 $PORT_3000_PID
  echo "✅ Process on port 3000 terminated"
else
  echo "No process found running on port 3000"
fi

# Find and kill any other Node.js processes related to our server
SERVER_PIDS=$(ps aux | grep "node.*server/server.js" | grep -v grep | awk '{print $2}')
if [ -n "$SERVER_PIDS" ]; then
  echo "Killing other server processes: $SERVER_PIDS"
  kill -9 $SERVER_PIDS
  echo "✅ Other server processes terminated"
else
  echo "No other server processes found"
fi

echo "Shutdown complete!"
