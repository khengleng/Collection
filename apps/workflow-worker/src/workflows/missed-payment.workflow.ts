import { proxyActivities, sleep, defineSignal, setHandler, condition } from '@temporalio/workflow';
import type { CollectionActivities } from '../activities/collection.activities';
import { CollectionActionType, MissingPaymentWorkflowInput, PromiseToPayInput } from '@collection/temporal-contracts';

const { createCase, sendCommunication, recordAudit } = proxyActivities<CollectionActivities>({
  startToCloseTimeout: '1 minute',
  retry: {
    initialInterval: '5 seconds',
    maximumAttempts: 10,
  },
});

export const paymentReceivedSignal = defineSignal('paymentReceived');
export const promiseToPaySignal = defineSignal<[PromiseToPayInput]>('promiseToPay');

export async function missedPaymentWorkflow(input: MissingPaymentWorkflowInput): Promise<string> {
  const { accountId, tenantId, amount, daysPastDue } = input;
  let isPaymentReceived = false;
  let activePromise: PromiseToPayInput | null = null;

  setHandler(paymentReceivedSignal, () => {
    isPaymentReceived = true;
    activePromise = null;
  });

  setHandler(promiseToPaySignal, (promise) => {
    activePromise = promise;
    recordAudit(`Promise to pay: ${promise.amount} on ${promise.dueDate}`, accountId);
  });

  // 1. Initial State Persistence
  const { caseId } = await createCase({ accountId, tenantId });
  await recordAudit('Lifecycle: Case Initialized', caseId);

  // 2. Initial Soft Collection (Day 1)
  if (!isPaymentReceived) {
    await sendCommunication({
      caseId,
      type: CollectionActionType.SMS,
      content: `Reminder: You have a payment of ${amount} due. Please resolve soon.`,
    });
  }

  // 3. Follow-up 1 (Wait 3 days or until paid/promised)
  await condition(() => isPaymentReceived || activePromise !== null, '3 days');

  if (isPaymentReceived) return 'Case closed: Early payment';

  if (!activePromise) {
    await sendCommunication({
      caseId,
      type: CollectionActionType.EMAIL,
      content: `Final soft reminder for account ${accountId}. We're here to help.`,
    });
  }

  // 4. Secondary Follow-up (Wait total 7 days)
  await condition(() => isPaymentReceived, '4 days');

  if (isPaymentReceived) return 'Case closed: Normal payment';

  // 5. Active Collection Strategy: Large vs Small Debt
  if (amount > 1000) {
    await sendCommunication({
      caseId,
      type: CollectionActionType.AGENT_TASK,
      content: `High value debt (${amount}) - Requesting manual agent call.`,
    });
  } else {
    await sendCommunication({
      caseId,
      type: CollectionActionType.CALL,
      content: 'Automated voice notice: Please pay your bill.',
    });
  }

  // 6. Escalation Step (Wait 14 days and check for Broken Promise)
  await condition(() => isPaymentReceived, '7 days');

  if (isPaymentReceived) return 'Case closed: Late payment';

  // Final Escalation
  await sendCommunication({
    caseId,
    type: CollectionActionType.CALL,
    content: `Final notice. Case escalated to credit bureaus.`,
  });
  await recordAudit('Escalation: Credit Bureau Notified', caseId);

  return 'Case Escalated';
}
