FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter workflow-worker

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/workflow-worker/dist ./apps/workflow-worker/dist
COPY --from=builder /app/apps/workflow-worker/package.json ./apps/workflow-worker/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 3002
CMD [ "node", "apps/workflow-worker/dist/main" ]
