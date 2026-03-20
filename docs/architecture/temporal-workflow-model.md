# Temporal Workflow Model

## Core Workflows

Workflows are long-running processes that orchestrate actions based on events and timers.

### 1. `MissedPaymentWorkflow`
- **Trigger**: `payment.missed` event.
- **Workflow ID**: `missed-payment-${tenantId}-${accountId}`.
- **Actions**:
  - `CheckAccountBalance`: Confirm total balance via Activity.
  - `EvaluateStrategy`: Decide if small, med, or lrg debt strategy.
  - `CreateCase`: Persistence via Activity if not exists.
  - `ScheduleFollowUp`: Wait for 2 days.
  - `RequestCommunication`: SMS/Email via Activity.
  - `WaitForSignal`: Listen for `payment.received` to terminate.

### 2. `PromiseMonitoringWorkflow`
- **Trigger**: `promise.created` event.
- **Workflow ID**: `promise-${tenantId}-${caseId}-${promiseId}`.
- **Actions**:
  - `SleepUntilDueDate`: Timer for Due Date.
  - `CheckPaymentExists`: Activity to confirm receipt.
  - `MarkBroken`: Activity if not paid.
  - `Terminate`: Completion.

### 3. `CaseEscalationWorkflow`
- **Trigger**: `case.escalated` event.
- **Workflow ID**: `escalation-${tenantId}-${caseId}`.
- **Actions**:
  - `NotifyManager`: Slack/Email/Task.
  - `StopAutomation`: Halt lower level comms.
  - `AssignAgent`: Logic via Activity.

## Design Rules
1. **Determinism**: Workflows **must not** have direct side effects (e.g., DB writes, Randomness).
2. **Activities**: All side effects live in Activities.
3. **Idempotency**: Use Workflow IDs for natural idempotency.
4. **Versioning**: Use `Workflow.PATCH` for logic changes on running workflows.
5. **Signals**: Communicate state changes (payment, reply) using Temporal signals.
