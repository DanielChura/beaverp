import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { StockItem } from './stock-item.entity';

@Entity()
export class Warehouse {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  tenantId: string;

  @Column({ nullable: false })
  name: string;

  @Column()
  location: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => StockItem, (item) => item.warehouse)
  stockItems: StockItem[];
}
