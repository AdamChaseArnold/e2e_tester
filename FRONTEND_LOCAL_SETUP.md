# Frontend Local Setup Guide

This guide provides instructions for running the E2E Tester frontend directly on your local machine without Docker.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Frontend

### Option 1: Using the dedicated script

Run the frontend with a single command from the project root:
```bash
./run-frontend-local.sh
```

This script will:
- Check for Node.js installation
- Clear port 3000 if it's in use
- Install dependencies if needed
- Start the React development server

### Option 2: Manual startup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```

## Configuration

The frontend is configured to proxy API requests to the backend running on port 5001. This is defined in `frontend/package.json`:

```json
"proxy": "http://localhost:5001"
```

If your backend is running on a different port, update this setting.

## Accessing the Frontend

Once started, the frontend will be available at:
- http://localhost:3000

## Backend Dependency

The frontend expects the backend to be running on port 5001. Make sure to start the backend first:

```bash
./start-backend.sh
```

Or use the combined script to start both services:

```bash
./run-local.sh
```

## Troubleshooting

1. **Port conflicts**: If port 3000 is already in use, you can:
   - Kill the process using the port: `fuser -k 3000/tcp`
   - Or configure React to use a different port by setting the PORT environment variable:
     ```bash
     PORT=3001 npm start
     ```

2. **API connection issues**: If you see errors connecting to the backend:
   - Verify the backend is running: `curl http://localhost:5001/health`
   - Check the proxy setting in `package.json`

3. **Module not found errors**: Try reinstalling dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```
