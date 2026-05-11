import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NodesService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.node.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        region: true,
        maintenanceMode: true,
        weight: true,
        _count: { select: { vms: true } },
      },
    });
  }
}
