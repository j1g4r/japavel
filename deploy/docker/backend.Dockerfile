FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config
COPY package.json package-lock.json turbo.json ./

# Copy all packages (simpler for monorepo resolution)
COPY packages ./packages

# Install dependencies
RUN npm ci

# Build backend (and dependent contracts)
WORKDIR /app/packages/backend
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package.json ./
COPY --from=builder /app/packages/backend/prisma ./prisma

EXPOSE 3000

CMD ["node", "dist/index.js"]
