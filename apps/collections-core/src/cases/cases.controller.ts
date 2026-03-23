import { Controller, Get, Post, Patch, Body, Param, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CaseStatus } from '@collection/shared-types';

@ApiTags('Cases')
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cases for the tenant' })
  @ApiResponse({ status: 200, description: 'Return all cases.' })
  async findAll(@Request() req: any) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.casesService.findAll(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single case' })
  @ApiResponse({ status: 200, description: 'Return the case.' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.casesService.findOne(id, tenantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new case' })
  async create(@Body() data: any, @Request() req: any) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.casesService.create(data, tenantId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update case status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: CaseStatus,
    @Request() req: any,
  ) {
    const tenantId = req.user?.tenantId || 'test-tenant-id';
    return this.casesService.updateStatus(id, status, tenantId);
  }
}
