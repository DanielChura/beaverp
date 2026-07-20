import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TenantsModule } from './tenants/tenants.module';
import { CatalogModule } from './catalog/catalog.module';
import { InventoryModule } from './inventory/inventory.module';
import { OrdersModule } from './orders/orders.module';
import { MarketplaceModule } from './marketplace/marketplace.module';
import { CustomersModule } from './customers/customers.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Tenant } from './tenants/entities/tenant.entity';
import { Category } from './catalog/entities/category.entity';
import { Product } from './catalog/entities/product.entity';
import { ProductVariant } from './catalog/entities/product-variant.entity';
import { ProductImage } from './catalog/entities/product-image.entity';
import { Warehouse } from './inventory/entities/warehouse.entity';
import { StockItem } from './inventory/entities/stock-item.entity';
import { StockMovement } from './inventory/entities/stock-movement.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Customer } from './customers/entities/customer.entity';
import { CustomerAddress } from './customers/entities/customer-address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('USER_DB'),
        password: configService.get<string>('PASS_DB'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          User,
          Tenant,
          Category,
          Product,
          ProductVariant,
          ProductImage,
          Warehouse,
          StockItem,
          StockMovement,
          Order,
          OrderItem,
          Customer,
          CustomerAddress,
        ],
        synchronize: configService.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
      }),
    }),
    EventEmitterModule.forRoot(),
    TenantsModule,
    CatalogModule,
    InventoryModule,
    OrdersModule,
    MarketplaceModule,
    CustomersModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
