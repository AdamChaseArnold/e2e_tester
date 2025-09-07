# Hello World Full Stack App

A complete full-stack application with React frontend, Express backend, and Playwright testing, all containerized with Docker.

## 🚀 Features

- **React 18** frontend with modern hooks and components
- **Express.js** backend with CORS, security middleware, and API endpoints
- **Playwright** end-to-end testing with multiple browser support
- **Docker** containerization with multi-stage builds
- **Docker Compose** for easy development and testing

## 📁 Project Structure

```
hello-world-app/
├── frontend/          # React application
│   ├── public/
│   ├── src/
│   └── package.json
├── backend/           # Express server
│   ├── server.js
│   ├── .env
│   └── package.json
├── tests/             # Playwright tests
│   └── hello-world.spec.js
├── Dockerfile
├── docker-compose.yml
├── playwright.config.js
└── package.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker 20.10+ and Docker Compose v2+

### Important Configuration Requirements

1. **Docker Services Separation**
   - Frontend and backend must run as separate services
   - Each service needs its own volume mounts for node_modules
   - Services must start in order: backend → frontend → tests

2. **Dependencies Installation**
   - Each service (frontend/backend) requires its own npm install
   - Dependencies must be installed in the correct directory structure
   - Node modules must have correct permissions (755)

3. **Network Configuration**
   - Backend must expose port 5000
   - Frontend must expose port 3000
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
- Backend server on http://localhost:5000
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

### Docker Setup

1. **Build and Start Services**
```bash
# Build images
docker-compose build

# Start services in correct order
docker-compose up -d backend
sleep 5  # Wait for backend to initialize
docker-compose up -d frontend
```

2. **Verify Services**
```bash
# Check backend health
curl http://localhost:5000/health

# Check frontend is responding
curl http://localhost:3000
```

3. **Run Tests**
```bash
# Run tests after services are healthy
docker-compose --profile test up
```

### Troubleshooting

1. **Permission Issues**
```bash
# Fix node_modules permissions
docker-compose exec backend chmod -R 755 /app/node_modules
docker-compose exec frontend chmod -R 755 /app/node_modules
```

2. **Service Health Checks**
```bash
# View service logs
docker-compose logs -f

# Check service status
docker-compose ps
```

3. **Dependencies Issues**
```bash
# Rebuild node_modules
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
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
- Containerization: Docker with Playwright base image

## 📝 License

MIT License
