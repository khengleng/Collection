import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Connection, Client, ClientOptions } from '@temporalio/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TemporalService implements OnModuleInit, OnModuleDestroy {
  private client: Client;
  private connection: Connection;
  private readonly logger = new Logger(TemporalService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const address = this.configService.get<string>('TEMPORAL_ADDRESS', 'localhost:7233');
    try {
      this.connection = await Connection.connect({ address });
      this.client = new Client({
        connection: this.connection,
        namespace: 'default',
      });
      this.logger.log(`Temporal Client connected to ${address}`);
    } catch (err) {
      this.logger.error('Failed to connect to Temporal:', err);
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  getClient(): Client {
    return this.client;
  }
}
