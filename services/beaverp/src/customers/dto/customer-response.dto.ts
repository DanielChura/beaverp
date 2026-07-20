import { Customer } from '../entities/customer.entity';

export class CustomerResponseDto {
  id: string;
  tenantId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  documentId: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.tenantId = customer.tenantId;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.email = customer.email;
    this.phone = customer.phone;
    this.documentId = customer.documentId;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
  }
}
