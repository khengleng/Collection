import { Injectable } from '@nestjs/common';
import { PrismaService } from '@collection/database';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.account.findMany({
      where: { tenantId },
      include: {
        debtor: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.account.findFirst({
      where: { id, tenantId },
      include: {
        debtor: true,
        cases: true,
        payments: true,
      },
    });
  }

  async findByDebtor(debtorId: string, tenantId: string) {
    return this.prisma.account.findMany({
      where: { debtorId, tenantId },
    });
  }
}
