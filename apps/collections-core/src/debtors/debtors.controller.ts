import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DebtorsService } from './debtors.service';

@ApiTags('Debtors')
@Controller('debtors')
export class DebtorsController {
  constructor(private readonly debtorsService: DebtorsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all debtors for the tenant' })
  @ApiResponse({ status: 200, description: 'Return all debtors.' })
  async findAll(@Request() req: any) {
    // tenantId should come from the user/tenant guard in a real app
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.debtorsService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single debtor' })
  @ApiResponse({ status: 200, description: 'Return the debtor.' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.debtorsService.findOne(id, tenantId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new debtor' })
  @ApiResponse({ status: 201, description: 'The debtor has been successfully created.' })
  async create(@Body() createDebtorDto: any, @Request() req: any) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.debtorsService.create(createDebtorDto, tenantId);
  }
}
