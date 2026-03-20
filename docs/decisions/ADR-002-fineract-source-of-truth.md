# ADR-002: Fineract as Financial Source of Truth

## Status
Accepted

## Context
Handling financial data in a debt collection system.

## Decision
Apache Fineract will be the **ultimate financial source of truth**.

## Implementation
- The Collection platform will **mirror** specific financial facts (e.g., delinquent accounts, balances).
- No direct writes to Fineract's database.
- Integration Service handles the sync logic.
- Platform logic only operates on mirrored data.

## Rationale
- Debt collection follows financial state, it doesn't always manage it.
- Prevents duplicated core loan servicing logic.
- Enables cleaner integration with other banking systems later.

## Consequences
- Requires continuous or event-driven sync.
- Handing of sync latency must be accounted for in workflows.
