import { Injectable } from '@nestjs/common';
import { PrismaService } from '@collection/database';
import { Debtor } from '@prisma/client';

@Injectable()
export class DebtorsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.debtor.findMany({
      where: { tenantId },
      include: {
        contacts: true,
      },
    });
  }

  async findOne(id: string, tenantId: string) {
    return this.prisma.debtor.findFirst({
      where: { id, tenantId },
      include: {
        contacts: true,
        accounts: true,
      },
    });
  }

  async create(data: any, tenantId: string) {
    const { contacts, ...rest } = data;
    return this.prisma.debtor.create({
      data: {
        ...rest,
        tenantId,
        contacts: {
          create: contacts,
        },
      },
      include: {
        contacts: true,
      },
    });
  }
}
