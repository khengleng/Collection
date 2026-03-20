FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter collections-core

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/collections-core/dist ./apps/collections-core/dist
COPY --from=builder /app/apps/collections-core/package.json ./apps/collections-core/package.json
COPY --from=builder /app/packages ./packages

EXPOSE 3001
CMD [ "node", "apps/collections-core/dist/main" ]
