import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FineractService } from './fineract.service';

@ApiTags('Fineract Integration')
@Controller('fineract')
export class FineractController {
  constructor(private readonly fineractService: FineractService) {}

  @Post('sync')
  @ApiOperation({ summary: 'Trigger a manual sync from Fineract' })
  async triggerSync() {
    return this.fineractService.syncDelinquentAccounts();
  }

  @Get('loan/:id')
  @ApiOperation({ summary: 'Get details for a Fineract loan' })
  async getLoan(@Param('id') id: string) {
    return this.fineractService.getLoanDetails(id);
  }
}
