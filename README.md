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
- Docker (optional)

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

### Docker

Build and run with Docker:
```bash
docker build -t hello-world-app .
docker run -p 3000:3000 -p 5000:5000 hello-world-app
```

Or use Docker Compose:
```bash
docker-compose up
```

Run tests with Docker Compose:
```bash
docker-compose --profile test up
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
