import { CustomerAddress } from '../entities/customer-address.entity';

export class CustomerAddressResponseDto {
  id: string;
  customerId: string;
  addressLine: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;

  constructor(address: CustomerAddress) {
    this.id = address.id;
    this.customerId = address.customerId;
    this.addressLine = address.addressLine;
    this.city = address.city;
    this.state = address.state;
    this.zipCode = address.zipCode;
    this.country = address.country;
    this.isDefault = address.isDefault;
  }
}
