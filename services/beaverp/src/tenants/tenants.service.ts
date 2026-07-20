import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(dto: CreateTenantDto): Promise<TenantResponseDto> {
    const exists = await this.tenantRepository.findOne({
      where: { taxId: dto.taxId },
    });
    if (exists) {
      throw new BadRequestException('El taxId ya está registrado');
    }

    const tenant = this.tenantRepository.create(dto);
    const saved = await this.tenantRepository.save(tenant);
    return new TenantResponseDto(saved);
  }

  async findAll(): Promise<TenantResponseDto[]> {
    const tenants = await this.tenantRepository.find();
    return tenants.map((t) => new TenantResponseDto(t));
  }

  async findOne(id: string): Promise<TenantResponseDto> {
    const tenant = await this.findTenant(id);
    return new TenantResponseDto(tenant);
  }

  async findById(id: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { id } });
  }

  async update(
    id: string,
    dto: UpdateTenantDto,
  ): Promise<TenantResponseDto> {
    const tenant = await this.findTenant(id);
    Object.assign(tenant, dto);
    const saved = await this.tenantRepository.save(tenant);
    return new TenantResponseDto(saved);
  }

  async remove(id: string): Promise<TenantResponseDto> {
    const tenant = await this.findTenant(id);
    await this.tenantRepository.remove(tenant);
    return new TenantResponseDto(tenant);
  }

  private async findTenant(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException('Tenant no encontrado');
    }
    return tenant;
  }
}
