# Codex Build Prompt — khengleng/Collection

You are working inside the GitHub repository `khengleng/Collection`.

Your job is to turn this repository into the foundation of a production-oriented **Debt Collection SaaS** using the architecture decisions below.

Do not ask for confirmation. Do not stop at planning. Execute the work in phases, commit cleanly structured code, and leave the repository in a runnable state with clear documentation.

---

## 1. Product and architecture decisions you must follow

Lock these decisions and do not redesign them away:

- **Apache Fineract** = financial source of truth
- **This app** = collections operating system
- **Temporal** = workflow brain from day 1
- **PostgreSQL + Redis + NestJS** = foundation
- **Split from day 1 only into a few high-value services**
- **One PostgreSQL cluster initially**
- **One Redis instance initially**
- **Modular monolith inside each service**
- **Event-driven communication between services where needed**
- **No tiny vanity microservices**
- **No duplicated core loan servicing logic from Fineract**

The day-1 services are:

1. **API Gateway**
2. **Collections Core**
3. **Workflow Worker**
4. **Integration Service**

Frontend apps can be scaffolded but backend foundation is the priority.

---

## 2. Primary objective

Build the repository so it becomes a working engineering baseline for a debt collection SaaS platform.

The repository must include:

- monorepo structure
- NestJS backend services
- PostgreSQL schema and migrations
- Redis wiring where appropriate
- Temporal setup from day 1
- event contracts
- Fineract integration scaffolding
- Docker-based local development
- documentation for setup and architecture

The result should be something an engineer can clone and start locally.

---

## 3. Repository structure to create

Use a monorepo layout like this:

```text
Collection/
  apps/
    api-gateway/
    collections-core/
    workflow-worker/
    integration-service/
    web-admin/              # optional scaffold only
    web-agent/              # optional scaffold only
    debtor-portal/          # optional scaffold only

  packages/
    shared-types/
    database/
    event-contracts/
    auth/
    rules-engine/
    comms-adapters/
    fineract-client/
    observability/
    temporal-contracts/

  infra/
    docker/
    temporal/
    scripts/

  docs/
    architecture/
    setup/
    decisions/

  .github/
    workflows/
```

You may use either **pnpm workspaces** or **Nx**. Prefer the lighter choice if speed matters.

---

## 4. Open-source components to bring into this repo

You are allowed to combine open-source dependencies into this repository, but do it sanely.

### Required integration targets
1. **Apache Fineract**
2. **Temporal**

### Rules for combining them
- Do **not** dump huge upstream source trees into the root blindly.
- Prefer one of these approaches:
  - Git submodule under `vendor/`
  - Git subtree under `vendor/`
  - documented Docker/service dependency in `infra/`
- Prefer the option that keeps this repo maintainable.
- If cloning full upstream source is too heavy or unnecessary, use Docker Compose services and provide adapter code in this repo instead.
- Keep all ownership boundaries clear.
- Do not rewrite Fineract internals unless absolutely necessary.
- This repo should integrate with Fineract, not become a fork-first science project.
- This repo should use Temporal as infrastructure and SDK dependency, not a vendored source-code dump unless there is a strong operational reason.

### Recommended approach
Use this default unless there is a very strong reason not to:
- **Do not vendor full Fineract source immediately**
- **Do not vendor full Temporal source immediately**
- Instead:
  - run Fineract and Temporal through Docker Compose or documented local infrastructure
  - create integration clients and configuration in this repo
  - document clearly how to replace those later with forks/submodules if needed

If you decide a submodule is truly needed, place it under:

```text
vendor/fineract/
vendor/temporal/
```

and document why.

---

## 5. Day-1 service boundaries and responsibilities

### 5.1 API Gateway
Responsibilities:
- authentication entrypoint
- tenant resolution
- request routing
- request ID / correlation ID propagation
- rate limiting
- shared guards and gateway middleware

Should expose:
- `/api/v1/*` public edge routes
- health endpoint
- docs endpoint if Swagger is enabled

### 5.2 Collections Core
This is the main business service.

Owns:
- tenants
- users and roles
- debtors
- debtor contacts
- mirrored accounts
- cases
- promises
- communications log
- workflow definitions
- workflow versions
- events
- audit logs
- reporting read models

Must be implemented as a modular monolith internally, not split into many tiny services yet.

### 5.3 Workflow Worker
Responsibilities:
- process collection events
- run Temporal workers from day 1
- execute workflow orchestrations for missed payments, promise monitoring, escalations, and communication scheduling
- own workflow/activity registration
- manage workflow retry semantics, timers, signals, and cancellation paths
- maintain clear workflow versioning and migration notes

Should include:
- worker bootstrap
- Temporal client and worker setup
- workflow definitions
- activity implementations
- clear boundaries between workflow logic and activity side effects

### 5.4 Integration Service
Responsibilities:
- integrate with Apache Fineract
- sync delinquent accounts and related financial facts into local mirror tables
- receive and normalize provider callbacks
- future payment gateway integration hooks
- external mapping tables / sync state

Must clearly treat:
- **Fineract as source of truth for financial state**
- **Collections Core as source of truth for collection operations**

---

## 6. Database ownership and design rules

Use **one PostgreSQL cluster** initially.

You may use:
- one database with clear table ownership, or
- separate schemas per service

Preferred option:
- one database
- separate schemas or clearly documented ownership rules
- single migration toolchain

### Core tables to create

At minimum create migrations/models for:

- tenants
- users
- roles
- debtors
- debtor_contacts
- accounts
- cases
- payments
- promises
- communications
- workflow_definitions
- workflow_versions
- events
- audit_logs
- external_account_mappings
- sync_runs

### Ownership rules

#### Collections Core owns
- tenants
- users
- roles
- debtors
- debtor_contacts
- accounts (mirror only)
- cases
- payments (collection-side records / ingested payment events)
- promises
- communications
- workflow_definitions
- workflow_versions
- events
- audit_logs

#### Integration Service owns
- external_account_mappings
- sync_runs
- provider delivery callback raw logs if needed
- Fineract sync metadata

### Important rule
Mirrored account data in your DB is **not** the ultimate financial source of truth. It is an operational projection for collections.

---

## 7. Event contracts to define

Create a shared event contract package.

At minimum define these domain events:

- `payment.missed`
- `payment.received`
- `promise.created`
- `promise.broken`
- `case.created`
- `case.assigned`
- `case.escalated`
- `debtor.replied`
- `communication.requested`
- `communication.sent`
- `communication.failed`
- `account.synced`
- `account.delinquent_detected`

For each event define:
- event name
- version
- payload schema
- idempotency expectations
- producer
- consumer(s)

Use TypeScript types and validation schemas if possible.

Also define how these map into Temporal workflow starts, signals, queries, or activity triggers where relevant.

---

## 8. Temporal requirements from day 1

Use Temporal as a first-class part of the architecture from the start.

### Temporal must be used for:
- missed payment orchestration
- promise-to-pay monitoring
- delayed follow-ups
- escalation timers
- cancellation on payment receipt or promise creation where applicable

### Temporal design rules
- workflows must be deterministic
- side effects must live in activities
- use workflow IDs and idempotency keys deliberately
- define retry policies explicitly
- use signals for state changes such as payment received or debtor replied
- document versioning approach for workflow evolution
- keep workflow logic readable and business-oriented

### Minimum workflows to scaffold
1. `MissedPaymentWorkflow`
2. `PromiseMonitoringWorkflow`
3. `CaseEscalationWorkflow`

### Minimum activities to scaffold
- create or update case
- persist audit record
- request communication
- fetch latest account facts
- evaluate strategy rules
- mark promise broken
- suppress or cancel pending actions

### Temporal local setup
Provide local Temporal infrastructure using Docker Compose or equivalent documented local setup.
Use Temporal TypeScript SDK in code.

---

## 9. MVP scope to implement now

Implement the smallest meaningful slice that proves the architecture.

### Must work
1. bootstrap monorepo
2. run PostgreSQL and Redis through Docker Compose
3. run Temporal locally through Docker Compose
4. start `collections-core`
5. start `api-gateway`
6. start `workflow-worker`
7. start `integration-service`
8. create database migrations and seed basic data
9. create health endpoints
10. create tenant-aware auth scaffold
11. implement CRUD or partial CRUD for:
   - debtors
   - accounts
   - cases
   - promises
12. implement event ingestion endpoint
13. implement one working collection workflow using Temporal:
   - when a delinquent/missed-payment event is ingested
   - create or update a case
   - schedule a follow-up
   - queue or request a communication action
   - log an audit record
14. implement Fineract client abstraction and one sync command or service stub
15. document how to run everything

### Nice to have
- Swagger / OpenAPI
- seed scripts
- sample Postman or Bruno collection
- local demo data
- basic dashboard scaffold

---

## 10. Tech choices

Use these unless there is a compelling reason not to:

- **TypeScript**
- **NestJS**
- **PostgreSQL**
- **Redis**
- **Temporal TypeScript SDK**
- **Prisma** or **TypeORM** for DB access
- **BullMQ** only if a non-Temporal queue is still needed for peripheral tasks
- **Docker Compose** for local orchestration
- **OpenAPI / Swagger**
- **ESLint + Prettier**
- **Jest** for basic tests

If choosing between Prisma and TypeORM, prefer:
- **Prisma** for speed and clarity
- but if NestJS module patterns fit better with TypeORM, that is acceptable

Be consistent.

---

## 11. Specific implementation tasks

Execute these in order:

### Phase A — Foundation
1. initialize monorepo
2. add root package manager config
3. add workspace config
4. add linting and formatting
5. add Docker Compose for:
   - postgres
   - redis
   - temporal
   - temporal-ui if practical
   - collections-core
   - api-gateway
   - workflow-worker
   - integration-service
   - optional fineract container or documented external dependency
6. add root README with quick start

### Phase B — Shared packages
Create packages for:
- shared-types
- event-contracts
- database
- auth
- fineract-client
- observability
- temporal-contracts

### Phase C — Services
Scaffold services:
- api-gateway
- collections-core
- workflow-worker
- integration-service

Each service needs:
- NestJS bootstrap
- config handling
- health endpoint
- logging
- env example file

### Phase D — Database
Create schema/migrations for the core tables.
Seed:
- one tenant
- one admin user
- one role
- sample debtor
- sample account
- sample case

### Phase E — Core APIs
In Collections Core and Gateway, implement:
- auth scaffold
- tenants/me
- debtors endpoints
- accounts endpoints
- cases endpoints
- promises endpoints
- event ingestion endpoint

### Phase F — Workflow path with Temporal
Implement:
- `payment.missed` event ingestion
- event persistence
- case creation/update
- audit record creation
- start `MissedPaymentWorkflow`
- schedule follow-up timer
- request communication through an activity or explicit service boundary
- support signal path for `payment.received` or promise creation to suppress or cancel pending actions where appropriate

### Phase G — Fineract integration
Implement:
- Fineract configuration module
- HTTP client wrapper
- sync service interface
- sample sync command / endpoint
- mapping table usage
- placeholder or real adapter depending on local setup

### Phase H — Documentation
Document:
- architecture
- service boundaries
- database ownership
- events
- local run instructions
- Temporal workflow model
- workflow versioning strategy
- how Fineract is treated as source of truth

---

## 12. Non-negotiable engineering rules

- Keep boundaries clean.
- Do not introduce many microservices.
- Do not make direct cross-service database writes.
- Do not duplicate Fineract’s core financial behavior.
- Use idempotency for event-driven flows.
- Add correlation IDs to logs.
- Keep code readable and boring in a good way.
- Put orchestration in Temporal workflows, not in random controllers.
- Put side effects in activities, not in workflow code.
- Prefer working code over over-engineered theory.
- Leave TODOs only when they are deliberate and documented.

---

## 13. Deliverables expected in the repo

By the end, the repo should contain:

- runnable monorepo
- Docker Compose setup
- backend services scaffolded
- shared packages
- database schema and migrations
- seed data
- event contracts
- Temporal setup and starter workflows
- one working event-to-case workflow through Temporal
- Fineract integration client scaffold
- README and architecture docs

Also add:

- `docs/architecture/day1-split-architecture.md`
- `docs/architecture/service-boundaries.md`
- `docs/architecture/event-contracts.md`
- `docs/architecture/temporal-workflow-model.md`
- `docs/setup/local-development.md`
- `docs/decisions/ADR-001-day1-service-split.md`
- `docs/decisions/ADR-002-fineract-source-of-truth.md`
- `docs/decisions/ADR-003-temporal-from-day1.md`

---

## 14. How to behave while executing

- Make the changes directly in the repo.
- Create files, code, configs, docs, and scaffolding.
- If something is ambiguous, choose the most practical option and document it.
- Prefer integration-through-adapters over vendoring giant upstream projects.
- Keep commit scopes sensible if committing is part of the workflow.
- Do not stop at a high-level plan.
- Produce a repository that is actually useful for a developer.

---

## 15. Final architectural reminder

Never forget this boundary:

- **Fineract owns financial truth**
- **Collection app owns collection operations**
- **Temporal is the workflow brain from day 1**
- **The goal is a collections operating system, not a random CRUD app with SMS**

Build accordingly.
