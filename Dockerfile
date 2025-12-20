# Dockerfile

# ---- Base ----
# Use a Node.js base image with a specific version for consistency.
# Using alpine for a smaller base image.
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
# Install production dependencies. This layer is cached if package.json doesn't change.
FROM base AS deps
RUN npm install --omit=dev

# ---- Builder ----
# This stage builds the application. It includes devDependencies.
FROM base AS builder
COPY . .
RUN npm install
RUN npm run build

# ---- Runner ----
# This is the final, production-ready stage. It's smaller and more secure.
FROM node:18-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy production dependencies from the 'deps' stage
COPY --from=deps /app/node_modules ./node_modules
# Copy the built application from the 'builder' stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./

# Expose the port the app will run on. Default is 3000 for a production Next.js app.
EXPOSE 3000

# The command to start the application.
CMD ["npm", "start"]
