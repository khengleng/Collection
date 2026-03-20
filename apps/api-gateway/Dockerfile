FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build --filter api-gateway

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-gateway/dist ./apps/api-gateway/dist
COPY --from=builder /app/apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY --from=builder /app/packages ./packages
# Note: we might need the compiled packages node_modules or dist as well.
# In a monorepo, sometimes it's easier to just copy the whole build output.

EXPOSE 3000
CMD [ "node", "apps/api-gateway/dist/main" ]
