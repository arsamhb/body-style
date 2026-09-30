# syntax=docker/dockerfile:1
# Frontend (Next.js) image — uses the standalone output (see next.config.ts).

# --- Build stage ---
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
# --ignore-scripts: the `prepare` script installs husky hooks and needs a .git folder.
RUN npm ci --ignore-scripts
COPY . .
# NEXT_PUBLIC_* values are inlined at build time, so pass the API base URL as a build arg.
ARG NEXT_PUBLIC_BASE_URL=http://localhost:4000
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_DEFAULT_LOCALE=fa
ARG API_INTERNAL_URL=http://server:4000
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    NEXT_PUBLIC_DEFAULT_LOCALE=$NEXT_PUBLIC_DEFAULT_LOCALE \
    API_INTERNAL_URL=$API_INTERNAL_URL
RUN npm run build

# --- Runtime ---
FROM node:24-alpine AS runtime
# HOSTNAME: Docker sets it to the container id, and the standalone server binds to it — that would
# leave it unreachable on 127.0.0.1 (healthcheck) and on the container's other networks.
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
