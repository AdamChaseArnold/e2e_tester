# Stage 1: Frontend build
FROM node:18-alpine AS frontend-builder
WORKDIR /app
# Only copy package files first for better caching
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend build
FROM node:18-alpine AS backend-builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

# Stage 3: Test environment (only when needed)
FROM mcr.microsoft.com/playwright:v1.40.0-jammy AS test
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tests/ ./tests/
COPY playwright.config.js ./
RUN npx playwright install chromium

# Stage 4: Frontend static server
FROM nginx:alpine AS frontend
COPY --from=frontend-builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]

# Stage 5: Backend production
FROM node:18-alpine AS backend
WORKDIR /app

# Install production dependencies
COPY backend/package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy backend files
COPY --from=backend-builder /app/ ./

# Create non-root user
RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /app

USER appuser
ENV NODE_ENV=production
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost:5000/health || exit 1

CMD ["npm", "start"]
