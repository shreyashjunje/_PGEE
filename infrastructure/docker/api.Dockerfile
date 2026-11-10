# Production image for apps/api. Build from the repo root:
#   docker build -f infrastructure/docker/api.Dockerfile -t pg-management-api .
# Run with DATABASE_URL (and optionally API_PORT, LOG_LEVEL, WEB_ORIGIN) set.

FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@pg/api
# Copies the built API plus production dependencies only (workspace packages included) to /out.
RUN pnpm --filter=@pg/api deploy --prod /out

FROM node:24-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /out .
USER node
EXPOSE 4000
CMD ["node", "--enable-source-maps", "dist/main.js"]
