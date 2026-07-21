import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

export interface OrderCreatedEvent {
  orderId: string;
  tenantId: string;
  totalAmount: number;
  channel: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  @OnEvent('order.created')
  handleOrderCreated(payload: OrderCreatedEvent) {
    this.logger.log(
      `[NOTIFICATION] Nueva orden ${payload.orderId} - Total: ${payload.totalAmount} - Canal: ${payload.channel}`,
    );
  }

  @OnEvent('order.paid')
  handleOrderPaid(payload: { orderId: string }) {
    this.logger.log(
      `[NOTIFICATION] Orden ${payload.orderId} pagada - Enviar factura`,
    );
  }
}
