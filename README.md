# E2E Tester Application

A complete full-stack application with React frontend, Express backend, and Playwright testing. This application runs directly on your local machine without containerization for easier development and testing.

## 🚀 Features

- **React 18** frontend with modern hooks and components
- **Express.js** backend with CORS, security middleware, and API endpoints
- **Playwright** end-to-end testing with multiple browser support

## 📁 Project Structure

```
e2e-tester/
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Express server
│   ├── server.js
│   ├── .env
│   └── package.json
├── tests/             # Playwright tests
│   └── url-navigation.spec.js
├── scripts/           # Utility scripts
│   └── local-health-check.sh
├── playwright.config.js
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Important Configuration Requirements

1. **Service Separation**
   - Frontend and backend run as separate services
   - Each service has its own dependencies
   - Services should start in order: backend → frontend → tests

2. **Dependencies Installation**
   - Each service (frontend/backend) requires its own npm install
   - Dependencies must be installed in the correct directory structure
   - Node modules must have correct permissions (755)

3. **Network Configuration**
   - Backend runs on port 5001
   - Frontend runs on port 3000
   - Services must wait for dependent services to be healthy

### Installation

1. Install all dependencies:
```bash
npm run install:all
```

2. Start the development servers:
```bash
npm start
```

This will start:
- Backend server on http://localhost:5001
- Frontend server on http://localhost:3000

### API Endpoints

- `GET /` - Root endpoint with welcome message
- `GET /api/hello` - Hello API with timestamp
- `GET /health` - Health check endpoint

### Testing

Run Playwright tests:
```bash
npm test
```

Run tests in headed mode:
```bash
npm test:headed
```

### Local Setup

1. **Start Services**
```bash
# Start both services with a single command
./run-local.sh

# Or start services individually
./run-backend-local.sh
./run-frontend-local.sh
```

2. **Verify Services**
```bash
# Check backend health
curl http://localhost:5001/health

# Check frontend is responding
curl http://localhost:3000
```

3. **Run Tests**
```bash
# Run tests after services are healthy
npm test
```

### Troubleshooting

1. **Port Conflicts**
```bash
# Check if ports are in use
lsof -i :5001
lsof -i :3000

# Kill processes using those ports
fuser -k 5001/tcp
fuser -k 3000/tcp
```

2. **Service Health Checks**
```bash
# Run the health check script
./scripts/local-health-check.sh
```

3. **Dependencies Issues**
```bash
# Reinstall dependencies
npm run install:all
```

## 🧪 What's Tested

The Playwright tests cover:
- Main page rendering
- API endpoint functionality
- Loading states
- Error handling
- UI interactions

## 🔧 Development

- Frontend: React with Create React App
- Backend: Express with security middleware
- Testing: Playwright for E2E tests

## 📝 License

MIT License
