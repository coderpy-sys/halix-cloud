import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IpamService } from './ipam.service';

@ApiTags('ipam')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('ipam')
export class IpamController {
  constructor(private readonly ipam: IpamService) {}

  @Get('pools')
  @ApiOperation({ summary: 'IPv4/IPv6 pools and ranges' })
  pools() {
    return this.ipam.pools();
  }

  @Get('summary')
  @ApiOperation({ summary: 'Counts by version and assignment state' })
  summary() {
    return this.ipam.summary();
  }
}
