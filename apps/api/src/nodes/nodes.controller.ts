import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodesService } from './nodes.service';

/** Admin RBAC to be layered here (ADMIN+). */
@ApiTags('nodes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('nodes')
export class NodesController {
  constructor(private readonly nodes: NodesService) {}

  @Get()
  @ApiOperation({ summary: 'List compute nodes (admin/staff in production)' })
  list() {
    return this.nodes.list();
  }
}
