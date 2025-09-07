# E2E Tester Decontainerization Guide

This guide provides step-by-step instructions for running the E2E Tester application directly on your local machine without Docker containers.

## Overview

The E2E Tester application has been fully decontainerized and can now run directly on your host machine. This guide covers:

1. Running the complete application locally
2. Running individual components (frontend/backend) separately
3. Configuration changes made during decontainerization
4. Testing the application

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Port Configuration

The application uses the following ports:
- Backend: 5001 (changed from 5000 to avoid conflicts)
- Frontend: 3000

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd e2e-tester
```

## Step 2: Install Dependencies

Install all dependencies for the main project, frontend, and backend:

```bash
npm run install:all
```

This will install dependencies for:
- Root project (Playwright and testing tools)
- Frontend (React application)
- Backend (Express API server)

## Step 3: Configure the Application

### Backend Configuration

The backend server is configured to run on port 5001. If you need to change this port:

1. Update the port in `/backend/server.js`:
   ```javascript
   const PORT = process.env.PORT || 5001;
   ```

2. Update the proxy configuration in `/frontend/package.json`:
   ```json
   "proxy": "http://localhost:5001"
   ```

### Frontend Configuration

The frontend is configured to proxy API requests to the backend. No additional configuration is needed if you're using the default ports.

## Step 4: Start the Application

### Option 1: Start Both Services Together (Recommended)

```bash
./run-local.sh
```

This script will:
- Kill any processes using ports 3000 and 5001
- Start the backend on port 5001
- Verify the backend is running
- Start the frontend on port 3000
- Clean up processes when you exit

### Option 2: Start Services Individually

Start the backend:
```bash
./run-backend-local.sh
```

Start the frontend:
```bash
./run-frontend-local.sh
```

### Option 3: Use npm Scripts

Start both services:
```bash
npm start
```

Start just the backend:
```bash
cd backend
npm start
```

Start just the frontend:
```bash
cd frontend
npm start
```

## Step 5: Verify the Application

1. Backend should be running at: http://localhost:5001
   - Health check: http://localhost:5001/health

2. Frontend should be running at: http://localhost:3000

3. Run the health check script:
   ```bash
   ./scripts/local-health-check.sh
   ```

## Step 6: Running Tests

Run the Playwright tests against your local services:

```bash
npm run local:test
```

For headed mode (with browser UI):
```bash
npm run test:headed
```

## Component-Specific Documentation

For more detailed information about running specific components:

- **Frontend**: See [FRONTEND_LOCAL_SETUP.md](./FRONTEND_LOCAL_SETUP.md)
- **Backend**: See [BACKEND_LOCAL_SETUP.md](./BACKEND_LOCAL_SETUP.md)

## Troubleshooting

### Port Conflicts

If you encounter port conflicts:

1. Check if any processes are using the required ports:
   ```bash
   lsof -i :5001
   lsof -i :3000
   ```

2. Kill any processes using those ports:
   ```bash
   kill -9 <PID>
   ```

### API Connection Issues

If the frontend can't connect to the backend:

1. Verify the backend is running:
   ```bash
   curl http://localhost:5001/health
   ```

2. Check the proxy configuration in `frontend/package.json`

3. Ensure CORS is properly configured in the backend

### Node Module Issues

If you encounter module not found errors:

```bash
npm run install:all
```

## Migrating from Docker

If you were previously using Docker containers:

1. Stop all Docker containers:
   ```bash
   docker-compose down
   ```

2. Follow the steps above to run the application locally

## Differences from Containerized Version

- **Port configuration**: Backend runs on 5001 instead of 5000
- **Environment**: Running directly on host machine instead of in containers
- **File access**: Direct file system access instead of Docker volumes
- **Networking**: Direct localhost communication instead of Docker network
- **Startup**: Using local scripts instead of Docker commands
- **Dependencies**: Installed directly on host machine
- **Configuration**: Using local environment variables instead of Docker environment

## Benefits of Decontainerization

- **Simplified development**: Faster iteration without container rebuilds
- **Direct debugging**: Easier to debug with direct access to processes
- **Reduced resource usage**: No Docker overhead
- **Easier onboarding**: Fewer dependencies for new developers
- **Flexible configuration**: Easier to modify environment variables

## When to Use Docker

While the application now runs locally without Docker, containers still provide benefits for:

- Production deployments
- Consistent environments across team members
- CI/CD pipelines
- Isolation from host system

The Docker configuration remains available if needed.
