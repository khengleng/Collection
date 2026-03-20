# ADR-003: Temporal from Day-1

## Status
Accepted

## Context
Process orchestration for complex, long-running debt collection workflows.

## Decision
Use **Temporal** as the primary workflow brain from Day-1.

## Implementation
- Workflow definitions for missed payment, promise monitoring, and escalations.
- Activity definitions for side effects (database writes, communications).
- Worker service to execute workflows.

## Rationale
- **Visibility**: Clear visibility of the state of any collection case.
- **Failover**: Automatic retry and state recovery.
- **Complexity**: Debt collection workflows are inherently long-running (weeks/months).
- **Scalability**: Orchestrates across many cases effortlessly.

## Consequences
- Requires Temporal infrastructure (Postgres/Elasticsearch).
- Developers must learn Temporal SDK / concepts (determinism).
- Requires workflow versioning strategy.
- Handled via local Docker Compose.
