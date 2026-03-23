import { Worker, NativeConnection } from '@temporalio/worker';
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as workflows from './workflows/missed-payment.workflow';
import { CollectionActivities } from './activities/collection.activities';

@Injectable()
export class WorkerService implements OnModuleInit, OnModuleDestroy {
  private worker!: Worker;
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly activities: CollectionActivities,
  ) {}

  async onModuleInit() {
    this.logger.log('Starting Temporal Worker...');
    const address = this.configService.get<string>('TEMPORAL_ADDRESS', 'localhost:7233');

    try {
      const connection = await NativeConnection.connect({
        address,
      });

      this.worker = await Worker.create({
        connection,
        namespace: 'default',
        taskQueue: 'missed-payment-queue',
        workflowsPath: require.resolve('./workflows/missed-payment.workflow'),
        activities: {
          createCase: this.activities.createCase.bind(this.activities),
          sendCommunication: this.activities.sendCommunication.bind(this.activities),
          recordAudit: this.activities.recordAudit.bind(this.activities),
        },
      });

      // Start the worker (non-blocking)
      this.worker.run().catch((err: any) => {
        this.logger.error('Worker run failed:', err);
      });

      this.logger.log(`Temporal Worker for missed-payment-queue started at ${address}`);
    } catch (err: any) {
      this.logger.error('Failed to start Temporal worker:', err);
    }
  }

  async onModuleDestroy() {
    if (this.worker) {
      await this.worker.shutdown();
      this.logger.log('Temporal Worker shut down.');
    }
  }
}
