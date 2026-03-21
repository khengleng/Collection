import { Injectable } from '@nestjs/common';
import { CollectionActionRequest } from '@collection/temporal-contracts';
import { Logger } from '@nestjs/common';

@Injectable()
export class CollectionActivities {
  private readonly logger = new Logger(CollectionActivities.name);

  async createCase(input: { accountId: string; tenantId: string }) {
    this.logger.log(`Activity: Creating/Updating case for account ${input.accountId}`);
    // Here we would call Collections Core service or write to DB directly
    // Rule in ADR-002: Modular monolith inside each service, but this is a different service.
    // So we should use an internal HTTP client or a shared lib.
    return { caseId: 'case-' + Math.random().toString(36).substr(2, 9) };
  }

  async sendCommunication(request: CollectionActionRequest) {
    this.logger.log(`Activity: Sending ${request.type} for case ${request.caseId}`);
    return { status: 'sent', sentAt: new Date().toISOString() };
  }

  async recordAudit(action: string, caseId: string) {
    this.logger.log(`Activity: Recording audit for action: ${action} on case: ${caseId}`);
  }
}
