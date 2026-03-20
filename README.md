# Debt Collection SaaS Platform Monorepo

This repository is the foundation of a production-oriented Debt Collection SaaS platform.

## Architecture

The platform is designed as a modular monorepo with the following services:

1.  **API Gateway** (`apps/api-gateway`): Authentication, tenant resolution, and request routing.
2.  **Collections Core** (`apps/collections-core`): Business logic for debtors, accounts, cases, and promises.
3.  **Workflow Worker** (`apps/workflow-worker`): Temporal workers for collections orchestration.
4.  **Integration Service** (`apps/integration-service`): Integration with Apache Fineract and other external providers.

## Tech Stack

- **Lanuage**: TypeScript
- **Framework**: NestJS
- **Database**: PostgreSQL (Prisma ORM)
- **Cache**: Redis
- **Workflow**: Temporal
- **Monorepo Tool**: pnpm workspaces + Turbo

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

### Local Development

1.  **Install dependencies**:
    ```bash
    pnpm install
    ```

2.  **Start infrastructure**:
    ```bash
    npm run docker:up
    ```

3.  **Run database migrations**:
    ```bash
    pnpm --filter @collection/database prisma:migrate
    ```

4.  **Start services**:
    ```bash
    npm run dev
    ```

## Documentation

- [Architecture Overview](docs/architecture/day1-split-architecture.md)
- [Service Boundaries](docs/architecture/service-boundaries.md)
- [Local Development Guide](docs/setup/local-development.md)
