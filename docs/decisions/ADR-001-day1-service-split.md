# ADR-001: Day-1 Service Split

## Status
Accepted

## Context
Initial architecture for the Debt Collection SaaS platform.

## Decision
Split into 4 primary services from the start:
1. API Gateway
2. Collections Core
3. Workflow Worker (Temporal)
4. Integration Service (Fineract)

## Rationale
- **Maintainability**: Clear separation of concern (Auth, Biz, Integration, Workflow).
- **Scalability**: Workers can be scaled independently of the API.
- **Resilience**: Integration issues from Fineract won't take down the entire platform.
- **Workflow-First**: Temporal is a core architectural choice, not a plugin.

## Consequences
- Requires monorepo management.
- Requires shared contracts between services.
- Overhead in local setup (handled by Docker Compose).
