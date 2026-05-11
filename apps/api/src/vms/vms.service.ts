import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VmsService {
  constructor(private readonly prisma: PrismaService) {}

  listForUser(userId: string) {
    return this.prisma.vm.findMany({
      where: { userId, status: { not: 'TERMINATED' } },
      include: {
        node: { select: { id: true, name: true, region: true } },
        ipAssignments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getForUser(userId: string, vmId: string) {
    const vm = await this.prisma.vm.findFirst({
      where: { id: vmId, userId },
      include: {
        node: true,
        ipAssignments: true,
        plan: true,
      },
    });
    if (!vm) throw new NotFoundException('VPS not found');
    return vm;
  }
}
