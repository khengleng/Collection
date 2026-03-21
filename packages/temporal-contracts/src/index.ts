export const MISSING_PAYMENT_WORKFLOW_ID = 'missing-payment';

export interface MissingPaymentWorkflowInput {
  tenantId: string;
  accountId: string;
  debtorId: string;
  amount: number;
  daysPastDue: number;
}

export enum CollectionActionType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  CALL = 'CALL',
  NEIGHBOR_NOTICE = 'NEIGHBOR_NOTICE',
  AGENT_TASK = 'AGENT_TASK',
}

export interface PromiseToPayInput {
  amount: number;
  dueDate: Date;
}

export interface CollectionActionRequest {
  caseId: string;
  type: CollectionActionType;
  content: string;
}
