import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ActiveTenant } from '../commons/decorators/active-tenant.decorator';

@Controller('customers')
@UseGuards(AuthGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(
    @Body() dto: CreateCustomerDto,
    @ActiveTenant() tenantId: string,
  ) {
    return this.customersService.create(dto, tenantId);
  }

  @Get()
  findAll(@ActiveTenant() tenantId: string) {
    return this.customersService.findAll(tenantId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @ActiveTenant() tenantId: string,
  ) {
    return this.customersService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @ActiveTenant() tenantId: string,
  ) {
    return this.customersService.update(id, dto, tenantId);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @ActiveTenant() tenantId: string,
  ) {
    return this.customersService.remove(id, tenantId);
  }
}
