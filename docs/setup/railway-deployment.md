# Railway Deployment Guide

This platform is a monorepo containing multiple services. To deploy them at scale on Railway, we recommend the following setup:

## Service Mapping

Each service in `apps/` should be configured as a separate service in the Railway dashboard:

| Service Name | Source Root | Build Command | Start Command |
|--------------|-------------|---------------|---------------|
| `api-gateway` | `/` | `pnpm build --filter api-gateway` | `node apps/api-gateway/dist/main` |
| `collections-core` | `/` | `pnpm build --filter collections-core` | `node apps/collections-core/dist/main` |
| `workflow-worker` | `/` | `pnpm build --filter workflow-worker` | `node apps/workflow-worker/dist/main` |
| `integration-service` | `/` | `pnpm build --filter integration-service` | `node apps/integration-service/dist/main` |

## Shared Database

Ensure `DATABASE_URL` is provided to `collections-core` and common packages.

## Temporal setup

The `workflow-worker` requires access to a Temporal cluster.
- **TEMPORAL_ADDRESS**: Address of the Temporal cluster (e.g., `temporal-cluster:7233`).
- **TEMPORAL_NAMESPACE**: Default is `default`.

## Build Environment

Ensure the following are set in Railway's build environment:
- `NPM_CONFIG_PRODUCTION=false` (to ensure devDependencies like `typescript` are installed for the build)
- `PNPM_HOME=/root/.local/share/pnpm`
- `PATH=$PNPM_HOME:$PATH`
- `PNPM_VERSION=9.0.0`
