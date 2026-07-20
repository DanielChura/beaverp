import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(
    dto: CreateCustomerDto,
    tenantId: string,
  ): Promise<CustomerResponseDto> {
    const exists = await this.customerRepository.findOne({
      where: { email: dto.email, tenantId },
    });
    if (exists) {
      throw new BadRequestException(
        'Ya existe un cliente con ese email en este tenant',
      );
    }

    const customer = this.customerRepository.create({ ...dto, tenantId });
    const saved = await this.customerRepository.save(customer);
    return new CustomerResponseDto(saved);
  }

  async findAll(tenantId: string): Promise<CustomerResponseDto[]> {
    const customers = await this.customerRepository.find({
      where: { tenantId },
    });
    return customers.map((c) => new CustomerResponseDto(c));
  }

  async findOne(id: string, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await this.findCustomer(id, tenantId);
    return new CustomerResponseDto(customer);
  }

  async update(
    id: string,
    dto: UpdateCustomerDto,
    tenantId: string,
  ): Promise<CustomerResponseDto> {
    const customer = await this.findCustomer(id, tenantId);
    Object.assign(customer, dto);
    const saved = await this.customerRepository.save(customer);
    return new CustomerResponseDto(saved);
  }

  async remove(id: string, tenantId: string): Promise<CustomerResponseDto> {
    const customer = await this.findCustomer(id, tenantId);
    await this.customerRepository.remove(customer);
    return new CustomerResponseDto(customer);
  }

  private async findCustomer(
    id: string,
    tenantId: string,
  ): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, tenantId },
    });
    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return customer;
  }
}
