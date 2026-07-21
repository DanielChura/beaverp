import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from '../commons/dto/PaginationDto';
import { AuthGuard } from '../commons/guards/auth.guard';
import { ActiveTenant } from '../commons/decorators/active-tenant.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @ActiveTenant() tenantId: string,
  ) {
    createUserDto.tenantId = tenantId;
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @ActiveTenant() tenantId: string,
  ) {
    return this.usersService.findAll(pagination, tenantId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveTenant() tenantId: string) {
    return this.usersService.findOne(id, tenantId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @ActiveTenant() tenantId: string,
  ) {
    return this.usersService.update(id, updateUserDto, tenantId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveTenant() tenantId: string) {
    return this.usersService.remove(id, tenantId);
  }
}
