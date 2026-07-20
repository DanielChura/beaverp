# BEAVERP — ERP Multicanal (NestJS)

## Propósito del Proyecto
Crear un sistema de Planificación de Recursos Empresariales (ERP) enfocado en la omnicanalidad (e-commerce, tiendas físicas, marketplaces). Permite a las empresas gestionar su catálogo, controlar el inventario y procesar órdenes de múltiples canales desde un único lugar centralizado.

## Principales Objetivos
1. **Lanzar un MVP Rápido y Funcional:** Entregar un producto base estable que resuelva el problema principal operativo.
2. **Escalabilidad y Flexibilidad:** Diseñar un núcleo sólido que soporte alto tráfico, múltiples tiendas (multi-tenant) y nuevas integraciones a futuro.
3. **Migración Transparente:** Permitir una transición arquitectónica fluida desde el Monolito inicial (para velocidad de desarrollo) hacia Microservicios distribuidos (para escalabilidad extrema) sin reescribir la lógica de negocio.

## Arquitectura Base (Monolito Modular en Capas)
Inicialmente, Beaverp se construye como un **Monolito en capas** (MVP). 
- **Capas Lógicas:** Controladores (HTTP), Servicios (Lógica de negocio), y Repositorios (Acceso a datos).
- **Diseño Modular:** Cada dominio de negocio (Auth, Catalog, etc.) está aislado en su propio módulo de NestJS.
- **Bajo Acoplamiento:** Para facilitar la migración futura a microservicios, los módulos se comunican entre sí mediante Eventos en memoria (`EventEmitter2`) o llamadas a interfaces estrictas. **Prohibido cruzar consultas a nivel de base de datos (ej. joins directos entre tablas de distintos módulos)**.

## Módulos del MVP
Para que el MVP esté completo como ERP base, necesita los siguientes módulos:

| Módulo | Responsabilidad |
|---|---|
| **Auth** | Seguridad, JWT, Aislamiento por cliente (Multi-tenant) y Usuarios |
| **Customers** | Gestión de clientes (CRM básico) y direcciones |
| **Catalog** | Productos, categorías, variantes y precios |
| **Inventory** | Control de stock físico, almacenes y reservas temporales |
| **Orders** | Ciclo de vida del pedido (creación, pago, envío) |
| **Marketplace** | Adaptadores para ingestar pedidos de canales externos |
| **Notifications** | Envío de correos, alertas del sistema y webhooks |

## Modelo de Dominio y Base de Datos
El diseño de base de datos detallado, optimizado para PostgreSQL (incluyendo manejo de variantes, imágenes y movimientos de inventario), se encuentra definido en: **[docs/DOMAIN_MODEL.md](file:///c:/Users/danie/dev/beaverp/docs/DOMAIN_MODEL.md)**

## Layout del Proyecto
```text
beaverp/
  services/
    beaverp/                → Aplicación Monolítica NestJS (MVP)
      src/
        auth/
        customers/
        catalog/
        inventory/
        orders/
        marketplace/
        notifications/
```
