# Day-1 Architecture Design

## Philosophy

The platform is built as a **modular monolith inside each service**, but split from day 1 into a few high-value services to enable clean boundaries and separate scalability.

## Core Components

### 1. API Gateway
The entrypoint for all external traffic. Responsible for:
- Tenant resolution
- Authentication
- Request routing
- Correlation ID propagation

### 2. Collections Core
The business heart of the platform. Owns:
- Debtors and Contacts
- Accounts (mirrored from Fineract)
- Cases and Status Transitions
- Promises to Pay
- Communications Logs

### 3. Workflow Worker
The "brain" using **Temporal**. Orchestrates complex flows like:
- Missed payment follow-ups
- Promise monitoring
- Escalation timers

### 4. Integration Service
The bridge to **Apache Fineract**.
- Syncs delinquent accounts into our local database.
- Normalizes external events into platform events.
- Fineract remains the financial source of truth.

## Database Strategy

- **One PostgreSQL cluster** for simplicity initially.
- Clear table ownership per service.
- **Prisma** for type-safe database access.

## Event Driven Communication

Services communicate via asynchronous events for non-blocking operations.
- Shared `event-contracts` package defines all domain events.
- Idempotency is a first-class requirement for all event consumers.
