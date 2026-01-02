FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config
COPY package.json package-lock.json turbo.json ./

# Copy all packages
COPY packages ./packages

# Install dependencies
RUN npm ci

# Build frontend
WORKDIR /app/packages/frontend
RUN npm run build

# Production Server (Nginx)
FROM nginx:alpine AS runner

COPY --from=builder /app/packages/frontend/dist /usr/share/nginx/html

# Add custom nginx config if needed (using default for now)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
