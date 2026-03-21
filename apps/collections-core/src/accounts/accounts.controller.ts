import { Controller, Get, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccountsService } from './accounts.service';

@ApiTags('Accounts')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the tenant' })
  @ApiResponse({ status: 200, description: 'Return all accounts.' })
  async findAll(@Request() req) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.accountsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single account' })
  @ApiResponse({ status: 200, description: 'Return the account.' })
  async findOne(@Param('id') id: string, @Request() req) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.accountsService.findOne(id, tenantId);
  }

  @Get('debtor/:debtorId')
  @ApiOperation({ summary: 'Get accounts for a specific debtor' })
  @ApiResponse({ status: 200, description: 'Return accounts for the debtor.' })
  async findByDebtor(@Param('debtorId') debtorId: string, @Request() req) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.accountsService.findByDebtor(debtorId, tenantId);
  }
}
