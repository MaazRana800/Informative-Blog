# Multi-stage build for production

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ ./
RUN npm run build

# Stage 2: Setup backend
FROM node:18-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ ./

# Stage 3: Production
FROM node:18-alpine
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/server ./server

# Copy frontend build
COPY --from=frontend-build /app/client/build ./client/build

# Install serve to serve frontend
RUN npm install -g serve pm2

# Expose ports
EXPOSE 5000 3000

# Create startup script
RUN echo '#!/bin/sh\n\
pm2 start server/server.js --name api\n\
serve -s client/build -l 3000\n\
pm2 logs' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"]
