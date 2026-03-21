import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@collection/database';
import { DomainEvent, EventName } from '@collection/event-contracts';
import { TemporalService } from '../temporal.service';
import { MISSING_PAYMENT_WORKFLOW_ID } from '@collection/temporal-contracts';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  constructor(
    private prisma: PrismaService,
    private temporalService: TemporalService,
  ) {}

  async ingest(event: DomainEvent) {
    // 1. Persist the event for audit/replayability
    const persistedEvent = await this.prisma.event.create({
      data: {
        id: event.id,
        name: event.name,
        tenantId: event.tenantId,
        payload: event.payload as any,
        source: event.producer,
      },
    });

    // 2. Trigger workflows based on event name
    if (event.name === EventName.PAYMENT_MISSED) {
      const client = this.temporalService.getClient();
      const { accountId, amount, daysPastDue } = event.payload;

      await client.workflow.start('missedPaymentWorkflow', {
        taskQueue: 'missed-payment-queue',
        workflowId: `missed-payment-${accountId}-${new Date().getTime()}`,
        args: [{
          tenantId: event.tenantId,
          accountId,
          amount,
          daysPastDue: daysPastDue || 1,
          debtorId: event.payload.debtorId || 'unknown'
        }],
      });
      
      this.logger.log(`Triggered missedPaymentWorkflow for account ${accountId}`);
    }

    return persistedEvent;
  }
}
