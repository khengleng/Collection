# Local Development Setup

## Prerequisites

- **Node.js**: v18+ (LTS)
- **pnpm**: v8+
- **Docker**: v20+
- **Docker Compose**: v2+

## Setup Steps

1.  **Clone the repository**:
    ```bash
    git clone <repo-url>
    cd Collection
    ```

2.  **Install dependencies**:
    ```bash
    pnpm install
    ```

3.  **Start Infrastructure**:
    Starts Postgres, Redis, and Temporal.
    ```bash
    npm run docker:up
    ```

4.  **Database Migration**:
    Initialize the database schema.
    ```bash
    pnpm --filter @collection/database prisma:migrate
    ```

5.  **Start Services**:
    Starts all backend services in watch mode using Turbo.
    ```bash
    npm run dev
    ```

## Service Ports

| Service | Port | Endpoint |
|---|---|---|
| API Gateway | 3000 | `http://localhost:3000/api/v1` |
| Collections Core | 3001 | `http://localhost:3001` |
| Workflow Worker | 3002 | `http://localhost:3002` |
| Integration Service | 3003 | `http://localhost:3003` |
| Temporal UI | 8080 | `http://localhost:8080` |
| Postgres | 5432 | `localhost:5432` |

## Common Commands

- **Build all**: `npm run build`
- **Lint all**: `npm run lint`
- **Format all**: `npm run format`
- **Stop Infra**: `npm run docker:down`
- **Prisma Studio**: `pnpm --filter @collection/database prisma:studio`

## Troubleshooting

- **Temporal Issues**: If the worker fails to connect, ensure `collection_temporal` container is running and healthy. Check logs: `docker logs collection_temporal`.
- **Port Conflicts**: Ensure ports 3000-3003 and 8080/5432/6379/7233 are free.
- **Node Modules**: If build fails, try `pnpm install` and `turbo clean`.
