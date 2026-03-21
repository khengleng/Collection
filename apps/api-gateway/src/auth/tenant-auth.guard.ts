import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class TenantAuthGuard implements CanActivate {
  private readonly logger = new Logger(TenantAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // For MVP/Demo purposes, we might allow a 'x-tenant-id' header
      const tenantId = request.headers['x-tenant-id'];
      if (!tenantId) {
        throw new UnauthorizedException('Tenant identification missing');
      }
      // Attach a mock user to the request
      request.user = { tenantId, id: 'demo-user-id' };
      return true;
    }

    // Real JWT validation would go here
    this.logger.log('Validating authorization header...');
    return true;
  }
}
