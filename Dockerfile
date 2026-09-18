# ==========================================
# Stage 1: Build React + Vite SPA
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Optional build argument for direct cross-origin API calls (defaults to relative /api)
ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Copy package definitions
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --include=dev

# Copy application source code
COPY . ./

# Build optimized static production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve SPA via Lightweight Nginx
# ==========================================
FROM nginx:alpine AS runner

WORKDIR /usr/share/nginx/html

# Clean default Nginx web root
RUN rm -rf /usr/share/nginx/html/*

# Copy built static files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Configure Nginx template with dynamic BACKEND_URL substitution
# Defaults to http://backend:5000 for Docker Compose, override via env in Cloud Run
ENV BACKEND_URL="http://backend:5000"
ENV NGINX_ENVSUBST_FILTER="BACKEND_URL"

# Copy template for runtime envsubst and default static conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Basic health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
