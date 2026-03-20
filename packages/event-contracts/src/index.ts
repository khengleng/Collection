export enum EventName {
  PAYMENT_MISSED = 'payment.missed',
  PAYMENT_RECEIVED = 'payment.received',
  PROMISE_CREATED = 'promise.created',
  PROMISE_BROKEN = 'promise.broken',
  CASE_CREATED = 'case.created',
  CASE_ASSIGNED = 'case.assigned',
  CASE_ESCALATED = 'case.escalated',
  DEBTOR_REPLIED = 'debtor.replied',
  COMMUNICATION_REQUESTED = 'communication.requested',
  COMMUNICATION_SENT = 'communication.sent',
  COMMUNICATION_FAILED = 'communication.failed',
  ACCOUNT_SYNCED = 'account.synced',
  ACCOUNT_DELINQUENT_DETECTED = 'account.delinquent_detected',
}

export interface DomainEvent<T = any> {
  id: string;
  name: EventName;
  version: string;
  payload: T;
  tenantId: string;
  producer: string;
  createdAt: Date;
  idempotencyKey?: string;
}

export interface PaymentMissedPayload {
  accountId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  daysPastDue: number;
}

export interface PaymentReceivedPayload {
  accountId: string;
  amount: number;
  currency: string;
  paymentId: string;
}

export interface CaseCreatedPayload {
  caseId: string;
  debtorId: string;
  accountId: string;
  initialBalance: number;
}

export interface CommunicationRequestedPayload {
  caseId: string;
  type: 'SMS' | 'EMAIL' | 'CALL';
  content?: string;
  templateId?: string;
}
