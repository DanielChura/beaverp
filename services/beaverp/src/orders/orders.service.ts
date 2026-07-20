import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateOrderDto, tenantId: string): Promise<Order> {
    const order = this.orderRepository.create({
      ...dto,
      tenantId,
      status: 'PENDING' as any,
    });
    const saved = await this.orderRepository.save(order);

    // Emit order.created for Inventory to deduct stock
    this.eventEmitter.emit('order.created', {
      orderId: saved.id,
      tenantId: saved.tenantId,
      totalAmount: saved.totalAmount,
      channel: saved.channel,
    });

    return saved;
  }

  findAll() {
    return `This action returns all orders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: any) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
