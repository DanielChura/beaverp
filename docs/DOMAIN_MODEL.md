# Modelo de Dominio (Entidades y Propiedades)

Este documento define el modelo de datos base (MVP) utilizando **PostgreSQL** y **TypeORM**. 

> **Regla de Multi-tenancy (CRÍTICA):** Toda entidad (excepto `Tenant`) debe tener una relación con `Tenant` a través de la columna `tenantId`. Esto garantiza el aislamiento de datos por cliente (Empresa). No debe existir ninguna consulta que no filtre por `tenantId`.

---

## 1. Módulo Auth / Core

### `Tenant`
Representa a la empresa o cliente que contrata el ERP.
- `id`: `uuid` (PK)
- `companyName`: `varchar`
- `taxId`: `varchar` (Unique)
- `isActive`: `boolean` (Default: true)
- `createdAt`, `updatedAt`: `timestamp`

### `User`
Los empleados o administradores de la empresa (Tenant).
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `email`: `varchar` (Unique)
- `passwordHash`: `varchar` (Oculto en select por defecto)
- `role`: `enum` (`admin`, `employee`)
- `isActive`: `boolean` (Default: true)
- `createdAt`, `updatedAt`: `timestamp`

---

## 2. Módulo Customers (CRM)

### `Customer`
El cliente final que realiza la compra (B2B o B2C).
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `firstName`, `lastName`: `varchar`
- `email`: `varchar` (Unique por Tenant)
- `phone`: `varchar` (Nullable)
- `documentId`: `varchar` (Nullable, DNI/RUT)
- `createdAt`, `updatedAt`: `timestamp`

### `CustomerAddress`
Direcciones del cliente (Envío y Facturación). *Buena práctica: separarlo para permitir múltiples direcciones.*
- `id`: `uuid` (PK)
- `customerId`: `uuid` (FK -> Customer)
- `addressLine`, `city`, `state`, `zipCode`, `country`: `varchar`
- `isDefault`: `boolean` (Default: false)

---

## 3. Módulo Catalog

### `Category`
Árbol jerárquico de categorías.
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `name`: `varchar`
- `slug`: `varchar` (Unique por Tenant)
- `parentId`: `uuid` (FK -> Category, Nullable, permite subcategorías)

### `Product`
El producto genérico.
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `name`: `varchar`
- `slug`: `varchar`
- `description`: `text`
- `categoryId`: `uuid` (FK -> Category, Nullable)
- `isActive`: `boolean`
- `createdAt`, `updatedAt`: `timestamp`

### `ProductVariant`
**Crucial para un ERP:** Permite gestionar tallas, colores o atributos sin ensuciar la tabla Product.
- `id`: `uuid` (PK)
- `productId`: `uuid` (FK -> Product)
- `sku`: `varchar` (Unique por Tenant)
- `attributes`: `jsonb` (Ej: `{"color": "red", "size": "M"}`). *Aprovechando PostgreSQL JSONB*.
- `price`: `decimal(10,2)`
- `barcode`: `varchar` (Nullable)

### `ProductImage`
*Buena práctica:* Tabla separada (1-N) para tener múltiples imágenes por producto, ordenarlas y definir portada.
- `id`: `uuid` (PK)
- `productId`: `uuid` (FK -> Product)
- `url`: `varchar`
- `isPrimary`: `boolean` (Default: false)
- `sortOrder`: `integer`

---

## 4. Módulo Inventory

### `Warehouse`
Bodegas físicas o tiendas donde hay stock.
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `name`: `varchar`
- `location`: `varchar`
- `isActive`: `boolean`

### `StockItem`
Refleja la cantidad real de una variante en una bodega específica.
- `id`: `uuid` (PK)
- `warehouseId`: `uuid` (FK -> Warehouse)
- `productVariantId`: `uuid` (FK -> ProductVariant)
- `quantity`: `integer` (Stock físico disponible)
- `reservedQuantity`: `integer` (Stock reservado por carritos/órdenes no finalizadas)

### `StockMovement`
*Buena práctica:* Registro inmutable (Append-only) para auditoría. No se hace `UPDATE` del stock directamente sin registrar el movimiento.
- `id`: `uuid` (PK)
- `warehouseId`: `uuid` (FK -> Warehouse)
- `productVariantId`: `uuid` (FK -> ProductVariant)
- `quantity`: `integer` (Positivo para entrada, Negativo para salida)
- `type`: `enum` (`IN`, `OUT`, `ADJUSTMENT`)
- `reason`: `varchar` (Ej: "Venta", "Devolución", "Merma")
- `referenceId`: `varchar` (Nullable, Ej: ID de la Orden que causó el movimiento)
- `createdAt`: `timestamp`

---

## 5. Módulo Orders

### `Order`
La cabecera de la orden.
- `id`: `uuid` (PK)
- `tenantId`: `uuid` (FK -> Tenant)
- `customerId`: `uuid` (FK -> Customer)
- `status`: `enum` (`PENDING`, `PAID`, `SHIPPED`, `CANCELLED`)
- `totalAmount`: `decimal(10,2)`
- `channel`: `varchar` (Ej: `web`, `pos`, `mercadolibre`)
- `createdAt`, `updatedAt`: `timestamp`

### `OrderItem`
El detalle histórico de la orden.
- `id`: `uuid` (PK)
- `orderId`: `uuid` (FK -> Order)
- `productVariantId`: `uuid` (FK -> ProductVariant)
- `quantity`: `integer`
- `unitPrice`: `decimal(10,2)` (Se congela el precio al momento de la venta)
- `subtotal`: `decimal(10,2)`
