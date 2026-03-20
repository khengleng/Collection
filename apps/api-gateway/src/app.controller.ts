import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  @Get('health')
  @ApiOperation({ summary: 'Check the health of the API Gateway' })
  getHealth() {
    return {
      status: 'ok',
      service: 'api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
