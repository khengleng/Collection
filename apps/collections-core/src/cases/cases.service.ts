import { Injectable } from '@nestjs/common';
import { PrismaService } from '@collection/database';
import { CaseStatus } from '@collection/shared-types';

@Injectable()
export class CasesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.case.findMany({
      where: { tenantId },
      include: {
        debtor: true,
        account: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.case.findFirst({
      where: { id, tenantId },
      include: {
        debtor: true,
        account: true,
        promises: true,
        communications: true,
      },
    });
  }

  async create(data: any, tenantId: string) {
    return this.prisma.case.create({
      data: {
        ...data,
        tenantId,
        status: CaseStatus.OPEN,
      },
    });
  }

  async updateStatus(id: string, status: CaseStatus, tenantId: string) {
    return this.prisma.case.updateMany({
      where: { id, tenantId },
      data: { status },
    });
  }
}
