import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VmsService } from './vms.service';
import type { RequestUser } from '../common/decorators/user.decorator';
import { CurrentUser } from '../common/decorators/user.decorator';

@ApiTags('vms')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('vms')
export class VmsController {
  constructor(private readonly vms: VmsService) {}

  @Get()
  @ApiOperation({ summary: 'List VPS for authenticated user' })
  list(@CurrentUser() user: RequestUser) {
    return this.vms.listForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'VPS detail' })
  get(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.vms.getForUser(user.id, id);
  }
}
