# Service Boundaries and Responsibilities

## API Gateway
- **Entrypoint**: `/api/v1/*`
- **Tenant Management**: Resolves tenant from request (e.g., host/subdomain/header).
- **Auth Service**: Validates JWTs, handles token generation.
- **Routing**: Proxies requests to internal services or handles them directly if lightweight.

## Collections Core
- **Debtors**: Master records of persons/entities (First/Last, Contacts).
- **Accounts**: Mirrored loan/credit records (External IDs, Balance, Status).
- **Cases**: The operational unit of work (Open/Closed, Assigned To, Status).
- **Promises**: Promise to pay records linked to cases (Amount, Due Date).
- **Audit**: Log of all actions taken on a case/debtor.

## Workflow Worker
- **Orchestration**: Executes workflows for delinquent account follow-ups.
- **Activities**:
  - `createCase`: Persistence call.
  - `sendCommunication`: Interface to communication adapter.
  - `checkPaymentStatus`: Query to mirrored data.
  - `escalateCase`: Status transition.

## Integration Service
- **Fineract Adapter**: Scrapes or syncs data from Apache Fineract.
- **Event Forwarding**: Normalizes Fineract webhooks/callbacks.
- **Mapping**: Keeps track of local ID vs Fineract ID.
- **Sync Runs**: Metadata about the state of historical sync.
