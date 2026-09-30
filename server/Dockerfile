# syntax=docker/dockerfile:1

# --- Build stage: compile TypeScript -> dist/ ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# --- Deps stage: production node_modules only ---
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# --- Runtime ---
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN mkdir -p /app/uploads && chown node:node /app/uploads
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 4000
CMD ["node", "dist/server.js"]
