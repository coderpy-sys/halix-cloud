import { Module } from '@nestjs/common';
import { VmsService } from './vms.service';
import { VmsController } from './vms.controller';

@Module({
  controllers: [VmsController],
  providers: [VmsService],
})
export class VmsModule {}
