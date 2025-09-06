# Use official Playwright image as base
FROM mcr.microsoft.com/playwright:v1.40.0-jammy

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies as root
RUN npm ci && \
    cd frontend && npm ci && \
    cd ../backend && npm ci && \
    cd .. && npm ci

# Copy source code
COPY . .

# Install Playwright browsers
RUN npx playwright install --with-deps

# Build React frontend
RUN cd frontend && npm run build

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser -m appuser

# Set permissions
RUN chown -R appuser:appuser /app
RUN chmod -R 755 /app/node_modules
RUN chmod -R 755 /app/frontend/node_modules
RUN chmod -R 755 /app/backend/node_modules

USER appuser

# Expose ports
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start command
CMD ["npm", "start"]
