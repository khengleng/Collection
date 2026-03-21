import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FineractService } from './fineract.service';
import { firstValueFrom } from 'rxjs';
import { EventName } from '@collection/event-contracts';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly coreApiUrl: string;

  constructor(
    private readonly fineractService: FineractService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.coreApiUrl = this.configService.get<string>('COLLECTIONS_CORE_URL', 'http://localhost:3001');
  }

  async runSync(tenantId: string) {
    this.logger.log(`Starting sync for tenant: ${tenantId}`);

    try {
      // 1. Fetch delinquent accounts from Fineract
      const fineractAccounts = await this.fineractService.syncDelinquentAccounts();
      // In a real scenario, this returns a list of accounts
      this.logger.log(`Fetched accounts from Fineract (Mock)`);

      // 2. Map and push to Collections Core
      // Here we would iterate over accounts and call Collections Core
      await this.pushToCore({
        name: EventName.ACCOUNT_SYNCED,
        tenantId,
        payload: { status: 'success', source: 'fineract' },
        id: Math.random().toString(36).substr(2, 9),
        version: '1.0',
        producer: 'integration-service',
        createdAt: new Date(),
      });

      return { status: 'completed', syncCount: 1 };
    } catch (error) {
      this.logger.error(`Sync failed: ${error.message}`);
      throw error;
    }
  }

  private async pushToCore(event: any) {
    await firstValueFrom(
      this.httpService.post(`${this.coreApiUrl}/events/ingest`, event),
    );
  }
}
