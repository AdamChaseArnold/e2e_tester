# Backend Local Setup Guide

This guide provides instructions for running the E2E Tester backend directly on your local machine without Docker.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Backend

### Option 1: Using the dedicated script

Run the backend with a single command from the project root:
```bash
./run-backend-local.sh
```

This script will:
- Check for Node.js installation
- Clear port 5001 if it's in use
- Install dependencies if needed
- Create a default .env file if one doesn't exist
- Start the Express server on port 5001

### Option 2: Manual startup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Set the port and start the server:
   ```bash
   PORT=5001 node server.js
   ```

## Configuration

The backend uses environment variables for configuration:

1. Create a `.env` file in the backend directory:
   ```
   PORT=5001
   ```

2. Additional environment variables you might want to set:
   ```
   NODE_ENV=development
   LOG_LEVEL=debug
   ```

## API Endpoints

Once started, the backend will expose the following endpoints:

- `GET /`: Basic API information
- `GET /health`: Health check endpoint
- `GET /api/hello`: Sample API endpoint
- `POST /api/check-url`: URL accessibility check endpoint

## Testing the Backend

You can test the backend with curl:

```bash
# Health check
curl http://localhost:5001/health

# URL check
curl -X POST -H "Content-Type: application/json" -d '{"url":"https://www.example.com"}' http://localhost:5001/api/check-url
```

## Troubleshooting

1. **Port conflicts**: If port 5001 is already in use, you can:
   - Kill the process using the port: `fuser -k 5001/tcp`
   - Or configure the backend to use a different port by setting the PORT environment variable:
     ```bash
     PORT=5002 node server.js
     ```
   - Remember to update the frontend proxy configuration if you change the port

2. **Module not found errors**: Try reinstalling dependencies:
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **CORS issues**: The backend is configured with CORS enabled. If you're experiencing CORS issues, check the CORS configuration in `server.js`
