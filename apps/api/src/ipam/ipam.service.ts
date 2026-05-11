import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * IPAM orchestration: pools → ranges → assignments.
 * Allocation jobs should run in BullMQ workers with row-level locking (SELECT … FOR UPDATE).
 */
@Injectable()
export class IpamService {
  constructor(private readonly prisma: PrismaService) {}

  pools() {
    return this.prisma.ipPool.findMany({
      include: { ranges: true },
      orderBy: { name: 'asc' },
    });
  }

  summary() {
    return this.prisma.ipAssignment.groupBy({
      by: ['version', 'state'],
      _count: { _all: true },
    });
  }
}
