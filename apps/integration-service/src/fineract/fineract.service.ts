import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FineractService {
  private readonly logger = new Logger(FineractService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>('FINERACT_BASE_URL', 'http://localhost:8080/fineract-provider/api/v1');
  }

  async getLoanDetails(loanId: string, tenantId: string = 'default') {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/loans/${loanId}`, {
          headers: {
            'Fineract-Platform-TenantId': tenantId,
          },
        }),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Error fetching loan ${loanId} from Fineract (tenant: ${tenantId}): ${error.message}`);
      throw error;
    }
  }

  async syncDelinquentAccounts(tenantId: string = 'default') {
    this.logger.log(`Starting sync of delinquent accounts from Fineract for tenant: ${tenantId}...`);
    // In a real implementation:
    // 1. Call Fineract /loans/delinquent API
    // 2. Fetch account details
    // 3. Emit events via events.ingest endpoint
    return {
      status: 'started',
      tenantId,
      timestamp: new Date().toISOString(),
    };
  }
}
