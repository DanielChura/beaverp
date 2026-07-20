import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  @OnEvent('order.created')
  handleOrderCreated(payload: { orderId: string; tenantId: string }) {
    this.logger.log(
      `[INVENTORY] Descontando stock para orden ${payload.orderId} del tenant ${payload.tenantId}`,
    );
    // FUTURE: Buscar OrderItems por orderId, descontar stock de cada variante
  }

  create(createInventoryDto: any) {
    return 'This action adds a new inventory';
  }

  findAll() {
    return `This action returns all inventory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`;
  }

  update(id: number, updateInventoryDto: any) {
    return `This action updates a #${id} inventory`;
  }

  remove(id: number) {
    return `This action removes a #${id} inventory`;
  }
}
