export interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  tenantId: string;
}

export enum CaseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  PROMISE_MADE = 'PROMISE_MADE',
  PROMISE_BROKEN = 'PROMISE_BROKEN',
  ESCALATED = 'ESCALATED',
}

export interface Case {
  id: string;
  tenantId: string;
  debtorId: string;
  accountId: string;
  status: CaseStatus;
  currentBalance: number;
  assignedTo?: string;
}
