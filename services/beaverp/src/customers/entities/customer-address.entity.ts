import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from './customer.entity';

@Entity()
export class CustomerAddress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  customerId: string;

  @ManyToOne(() => Customer, (cust) => cust.addresses)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  addressLine: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column()
  country: string;

  @Column({ default: false })
  isDefault: boolean;
}
