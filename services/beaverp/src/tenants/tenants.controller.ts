import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ActiveTenant } from '../commons/decorators/active-tenant.decorator';

@Controller('tenants')
@UseGuards(AuthGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('me')
  findMe(@ActiveTenant() tenantId: string) {
    return this.tenantsService.findOne(tenantId);
  }

  @Patch('me')
  updateMe(
    @Body() dto: UpdateTenantDto,
    @ActiveTenant() tenantId: string,
  ) {
    return this.tenantsService.update(tenantId, dto);
  }
}
