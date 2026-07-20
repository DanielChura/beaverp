import { Tenant } from '../entities/tenant.entity';

export class TenantResponseDto {
  id: string;
  companyName: string;
  taxId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(tenant: Tenant) {
    this.id = tenant.id;
    this.companyName = tenant.companyName;
    this.taxId = tenant.taxId;
    this.isActive = tenant.isActive;
    this.createdAt = tenant.createdAt;
    this.updatedAt = tenant.updatedAt;
  }
}
