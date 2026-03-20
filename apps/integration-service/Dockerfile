FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter integration-service

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/integration-service/dist ./apps/integration-service/dist
COPY --from=builder /app/apps/integration-service/package.json ./apps/integration-service/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 3003
CMD [ "node", "apps/integration-service/dist/main" ]
