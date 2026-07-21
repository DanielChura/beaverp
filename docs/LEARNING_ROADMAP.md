# BEAVERP — Roadmap y Checklist del MVP (Monolito Modular)

> **Objetivo:** Tener un ERP multi-tenant funcional listo para migrar a microservicios.
> Cada checkbox representa una unidad de trabajo completada. Al tachar todas, el MVP está listo.

---

## FASE 0: Setup y Core del Proyecto

### 0.1 Infraestructura base
- [x] Proyecto NestJS inicializado con TypeScript
- [x] Variables de entorno centralizadas (`.env`)
- [x] Conexión PostgreSQL vía TypeORM (config async)
- [x] JWT configurado (secreto, expiración)
- [x] EventEmitter2 instalado y configurado (`EventEmitterModule.forRoot()`)

### 0.2 Entidades base
- [x] `Tenant` — id, companyName, taxId (unique), isActive, timestamps
- [x] `User` — id, tenantId (FK), email (unique global), passwordHash, role (admin|employee), isActive, timestamps
- [x] Relación `Tenant` 1:N `User` con CASCADE delete

---

## FASE 1: Auth y Multi-tenancy

### 1.1 Registro y autenticación
- [x] `POST /auth/register` — Crea Tenant + User admin en un paso. Público.
- [x] `POST /auth/login` — Valida credenciales, devuelve JWT con `{ sub, role, tenantId }`
- [x] JWT guard (`AuthGuard`) — extrae y verifica token Bearer
- [x] `@ActiveTenant()` decorator — extrae `tenantId` del payload del JWT

### 1.2 Multi-tenancy — Aislamiento de datos
- [x] Toda entidad de negocio tiene columna `tenantId` (FK -> Tenant)
- [x] `CustomersService` — filtra por tenantId en TODAS las queries
- [x] `UsersService.findAll()` — filtra por tenantId
- [x] `UsersService.findOne()` — filtra por tenantId
- [x] `UsersService.update()` — filtra por tenantId
- [x] `UsersService.remove()` — filtra por tenantId
- [x] `UsersController` — inyecta `@ActiveTenant()` en create/findAll/findOne/update/remove
- [x] `UsersController.create()` — fuerza tenantId del JWT, ignora el del body

### 1.3 Endpoints de administración
- [x] `GET /tenants/me` — Devuelve el tenant del usuario autenticado
- [x] `PATCH /tenants/me` — Actualiza el propio tenant
- [x] CRUD de usuarios scoped al tenant (`/users`) con paginación
- [x] `UsersService.findByEmail()` — para login (sin tenantId, email es global unique)

---

## FASE 2: Módulos de Dominio — Entities y DTOs

### 2.1 Customers (CRM)
- [x] Entity `Customer` con tenantId, firstName, lastName, email, phone, documentId
- [x] Entity `CustomerAddress` con customerId, addressLine, city, state, zipCode, country, isDefault
- [x] DTOs con validación (CreateCustomerDto, UpdateCustomerDto, CustomerResponseDto)
- [x] `CustomersController` CRUD completo con AuthGuard + @ActiveTenant
- [x] CRUD de direcciones (`/customers/:customerId/addresses`) con multi-tenant scoping

### 2.2 Catalog
- [x] Entity `Category` — id, tenantId, name, slug, parentId (árbol jerárquico)
- [x] Entity `Product` — id, tenantId, name, slug, description, categoryId, isActive, timestamps
- [x] Entity `ProductVariant` — id, productId, sku, attributes (jsonb), price, barcode
- [x] Entity `ProductImage` — id, variantId, url, isPrimary, sortOrder
- [ ] `CatalogService` real con TypeORM — reemplazar stubs
- [ ] Filtro multi-tenant en todas las queries de catálogo
- [ ] AuthGuard en `CatalogController`
- [ ] `+id` type bug: cambiar `+id` a `id: string` en controller
- [ ] DTOs con validación (CreateCategoryDto, CreateProductDto, etc.)

### 2.3 Inventory
- [x] Entity `Warehouse` — id, tenantId, name, location, isActive
- [x] Entity `StockItem` — id, warehouseId, productVariantId, quantity, reservedQuantity
- [x] Entity `StockMovement` — id, warehouseId, productVariantId, quantity, type (IN|OUT|ADJUSTMENT), reason, referenceId, createdAt
- [ ] `InventoryService` real con TypeORM — reemplazar stubs
- [ ] Filtro multi-tenant en todas las queries de inventario
- [ ] AuthGuard en `InventoryController`
- [ ] `+id` type bug: cambiar `+id` a `id: string` en controller
- [ ] DTOs con validación (CreateWarehouseDto, StockMovementDto, etc.)

### 2.4 Orders
- [x] Entity `Order` — id, tenantId, customerId, status (PENDING|PAID|SHIPPED|CANCELLED), totalAmount, channel, timestamps
- [x] Entity `OrderItem` — id, orderId, productVariantId, quantity, unitPrice, subtotal
- [x] `OrdersService.create()` real con TypeORM + emisión de evento `order.created`
- [ ] `OrdersService.findAll()` real con filtro multi-tenant
- [ ] `OrdersService.findOne()` real con filtro multi-tenant
- [ ] `OrdersService.update()` real con filtro multi-tenant (ej: cambiar status)
- [ ] `OrdersService.remove()` real con filtro multi-tenant (solo cancelación lógica?)
- [ ] DTOs con validación (CreateOrderDto con items embebidos, UpdateOrderDto, etc.)
- [ ] AuthGuard en findAll/findOne/update/remove (create ya tiene)
- [ ] `+id` type bug: cambiar `+id` a `id: string` en controller

### 2.5 Marketplace
- [ ] Definir modelo: ¿solo adapter para recibir órdenes externas? ¿o entities de canal?
- [ ] Entity `Marketplace` con tenantId, name, channel (ML, Shopify, etc.), apiKey, isActive
- [ ] Service real + DTOs con validación
- [ ] AuthGuard en `MarketplaceController`

---

## FASE 3: Lógica de Negocio y Eventos

### 3.1 Flujo de creación de orden
- [x] `POST /orders` crea orden con status=PENDING y emite `order.created`
- [ ] `OrdersService.create()` guarda también los `OrderItem` (hoy solo guarda la cabecera)
- [ ] Descuento de stock real en `InventoryService.handleOrderCreated()`
- [ ] Validación: verificar stock disponible antes de confirmar orden
- [ ] Emitir `order.paid` desde `OrdersService` (endpoint PATCH /orders/:id/pay o similar)

### 3.2 Notificaciones y eventos
- [x] `NotificationsService` escucha `order.created` y loguea
- [x] `NotificationsService` escucha `order.paid` y loguea
- [ ] Integrar envío real (email, push, etc.) o dejar hook para futuro
- [ ] Emitir `order.cancelled` para que Inventory reverse el stock

### 3.3 Marketplaces (integración externa)
- [ ] Endpoint `POST /marketplace/webhook` para recibir órdenes de canales externos
- [ ] Adaptador que convierte orden de marketplace a `CreateOrderDto` y llama a `OrdersService.create()`

---

## FASE 4: Consistencia y Calidad

### 4.1 Validación y errores
- [ ] DTOs con `class-validator` en TODOS los módulos (Catalog, Inventory, Orders, Marketplace)
- [ ] Global exception filter para respuestas uniformes (`{ statusCode, message, timestamp }`)
- [ ] Errores 404 con NotFoundException en todos los findOne/update/remove

### 4.2 Paginación
- [x] `PaginationDto` y `ResponseDto` genéricos en commons
- [x] Users.findAll con paginación
- [ ] Customers.findAll con paginación
- [ ] Catalog.findAll (categories, products) con paginación
- [ ] Inventory.findAll (warehouses, stockItems) con paginación
- [ ] Orders.findAll con paginación

### 4.3 Seguridad
- [x] AuthGuard protege: Users, Tenants, Customers, Orders.create
- [ ] AuthGate protege: Catalog, Inventory, Marketplace
- [ ] Route `POST /tenants` eliminada (solo creación vía register)
- [ ] Route `DELETE /tenants` eliminada
- [ ] RolesGuard para diferenciar admin vs employee (opcional para MVP)

---

## FASE 5: Pre-Microservicios (Desacoplamiento)

### 5.1 Bajo acoplamiento entre módulos
- [x] Comunicación cross-module vía EventEmitter2 (no imports directos de repositories)
- [x] `OrdersService.create()` emite `order.created` — Inventory escucha
- [ ] Ningún service importa repositories de otro módulo
- [ ] Crear interfaz/adapter para cada módulo expuesto (ej: `IInventoryService`)

### 5.2 API coherente
- [ ] Prefix `/api/v1` en todas las rutas (config global)
- [ ] Responses consistentes con `ResponseDto<T>` en todos los endpoints
- [ ] Documentación OpenAPI/Swagger básica

### 5.3 Datos y testing
- [ ] Seed data para desarrollo (tenant demo, admin, productos, clientes)
- [ ] Health check endpoint (`GET /health`)
- [ ] Script `pnpm start:dev` funcional (ya debe funcionar)

---

## FASE 6: Migración a Microservicios (Futuro)

> Esto NO es parte del MVP. Es la hoja de ruta posterior.

- [ ] Separar `Auth` como microservicio independiente
- [ ] Implementar API Gateway (NestJS Gateway o Express)
- [ ] Reemplazar EventEmitter2 por RabbitMQ/Redis
- [ ] Extraer `Catalog` como microservicio
- [ ] Extraer `Inventory` como microservicio
- [ ] Extraer `Orders` como microservicio
- [ ] Implementar Circuit Breaker (Resilience4j / @nestjs/bull?)
- [ ] Implementar Sagas coreografiadas para flujos multi-servicio
- [ ] Tracing distribuido (OpenTelemetry)
- [ ] Despliegue con Docker Compose → Kubernetes

---

## Leyenda del Checklist

| Símbolo | Significado |
|---------|-------------|
| `[x]` | Completado verificado |
| `[ ]` | Pendiente por hacer |
| `[~]` | En progreso |

> **Regla de oro:** Si un módulo no filtra por `tenantId` en TODAS sus queries, no está completo.
> El orden sugerido: Fase 0 → 1 → 2 → 3 → 4 → 5. Dentro de cada fase, priorizar Customers > Catalog > Orders > Inventory > Marketplace.
