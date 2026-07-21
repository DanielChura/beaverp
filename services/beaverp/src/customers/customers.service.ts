import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerAddress } from './entities/customer-address.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto';
import { CustomerAddressResponseDto } from './dto/customer-address-response.dto';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(CustomerAddress)
    private readonly addressRepository: Repository<CustomerAddress>,
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

  private async findCustomer(id: string, tenantId: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id, tenantId },
    });
    if (!customer) {
      throw new NotFoundException('Cliente no encontrado');
    }
    return customer;
  }

  async createAddress(
    customerId: string,
    dto: CreateCustomerAddressDto,
    tenantId: string,
  ): Promise<CustomerAddressResponseDto> {
    await this.findCustomer(customerId, tenantId);

    if (dto.isDefault) {
      await this.addressRepository.update({ customerId }, { isDefault: false });
    }

    const address = this.addressRepository.create({ ...dto, customerId });
    const saved = await this.addressRepository.save(address);
    return new CustomerAddressResponseDto(saved);
  }

  async findAddresses(
    customerId: string,
    tenantId: string,
  ): Promise<CustomerAddressResponseDto[]> {
    await this.findCustomer(customerId, tenantId);
    const addresses = await this.addressRepository.find({
      where: { customerId },
      order: { isDefault: 'DESC' },
    });
    return addresses.map((a) => new CustomerAddressResponseDto(a));
  }

  async findOneAddress(
    addressId: string,
    customerId: string,
    tenantId: string,
  ): Promise<CustomerAddressResponseDto> {
    await this.findCustomer(customerId, tenantId);
    const address = await this.findAddress(addressId, customerId);
    return new CustomerAddressResponseDto(address);
  }

  async updateAddress(
    addressId: string,
    customerId: string,
    dto: UpdateCustomerAddressDto,
    tenantId: string,
  ): Promise<CustomerAddressResponseDto> {
    await this.findCustomer(customerId, tenantId);
    const address = await this.findAddress(addressId, customerId);

    if (dto.isDefault) {
      await this.addressRepository.update({ customerId }, { isDefault: false });
    }

    Object.assign(address, dto);
    const saved = await this.addressRepository.save(address);
    return new CustomerAddressResponseDto(saved);
  }

  async removeAddress(
    addressId: string,
    customerId: string,
    tenantId: string,
  ): Promise<CustomerAddressResponseDto> {
    await this.findCustomer(customerId, tenantId);
    const address = await this.findAddress(addressId, customerId);
    await this.addressRepository.remove(address);
    return new CustomerAddressResponseDto(address);
  }

  private async findAddress(
    id: string,
    customerId: string,
  ): Promise<CustomerAddress> {
    const address = await this.addressRepository.findOne({
      where: { id, customerId },
    });
    if (!address) {
      throw new NotFoundException('Dirección no encontrada');
    }
    return address;
  }
}
