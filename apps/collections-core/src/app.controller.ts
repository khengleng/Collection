import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Check the health of the Collections Core' })
  getHealth() {
    return {
      status: 'ok',
      service: 'collections-core',
      timestamp: new Date().toISOString(),
    };
  }
}
