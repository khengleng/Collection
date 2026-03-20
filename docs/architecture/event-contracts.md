# Event Contracts

## Domain Events

Services emit domain events to notify other parts of the system about state changes.

| Event Name | Producer | Primary Consumer(s) | Trigger |
|---|---|---|---|
| `payment.missed` | Integration / Fineract | Collections Core / Workflow Worker | Account status delinquent or overdue. |
| `payment.received` | Integration / Fineract | Collections Core / Workflow Worker | Payment reconciled in bank/Fineract. |
| `promise.created` | Collections Core | Workflow Worker | Debtor commits to a payment plan. |
| `promise.broken` | Workflow Worker | Collections Core | Promise due date passed without payment. |
| `case.created` | Collections Core | Audit / Notifications | New collection case opened. |
| `account.delinquent_detected` | Integration | Collections Core | Initial sync logic identifies overdue. |
| `communication.requested` | Workflow Worker | Comms Adapter / Core | Workflow reach out trigger. |

## Event Schema

All events follow the `DomainEvent<T>` structure defined in `@collection/event-contracts`:

```typescript
export interface DomainEvent<T = any> {
  id: string;
  name: string;
  version: string;
  payload: T;
  tenantId: string;
  producer: string;
  createdAt: Date;
  idempotencyKey?: string;
}
```

## Consumer Rules
- **Idempotency**: All consumers must handle duplicate events.
- **Ordered Delivery**: Best effort, but consumers should be resilient to out-of-order delivery where possible.
- **Payload Stability**: Do not remove fields from existing event versions.
