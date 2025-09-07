# Local Setup Instructions for E2E Tester

This document provides instructions for running the E2E Tester application directly on your local machine without Docker.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd e2e-tester
   ```

2. Install all dependencies:
   ```bash
   npm run install:all
   ```

## Running the Application

### Option 1: Using the start script

Run the application with a single command:
```bash
npm run local:start
```

This will start both the backend and frontend services concurrently.

### Option 2: Starting services individually

1. Start the backend:
   ```bash
   cd backend
   npm start
   ```

2. In a separate terminal, start the frontend:
   ```bash
   cd frontend
   npm start
   ```

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Backend Health Check: http://localhost:5000/health

## Running Tests

Run the Playwright tests:
```bash
npm run local:test
```

For headed mode (with browser UI):
```bash
npm run test:headed
```

## Verifying Services

To check if all services are running correctly:
```bash
npm run verify-local
```

## Troubleshooting

1. **Port conflicts**: Ensure ports 3000 and 5000 are not in use by other applications.

2. **Backend not accessible**: Check if the backend is running with:
   ```bash
   curl http://localhost:5000/health
   ```

3. **Frontend proxy issues**: If the frontend can't connect to the backend, check the proxy configuration in `frontend/package.json`.

4. **Node modules issues**: If you encounter module not found errors, try reinstalling dependencies:
   ```bash
   npm run install:all
   ```

## Project Structure

- `frontend/`: React application
- `backend/`: Express API server
- `tests/`: Playwright end-to-end tests
- `scripts/`: Utility scripts for health checks and setup
