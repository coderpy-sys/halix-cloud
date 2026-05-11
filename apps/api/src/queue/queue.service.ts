import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bullmq';
import IORedis from 'ioredis';

/**
 * BullMQ queues: `vps-provision`, `vps-reinstall`, `vps-power`, `ip-allocate`, `metrics-scrape`, `backup-run`.
 * Workers run as separate processes or containers sharing this codebase.
 */
@Injectable()
export class QueueService implements OnModuleDestroy {
  readonly connection: IORedis;
  readonly provision: Queue;

  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL') ?? 'redis://127.0.0.1:6379';
    this.connection = new IORedis(url, { maxRetriesPerRequest: null });
    this.provision = new Queue('vps-provision', {
      connection: this.connection,
    });
  }

  async onModuleDestroy() {
    await this.provision.close();
    await this.connection.quit();
  }
}
