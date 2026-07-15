# BEAVERP — ERP Multicanal (NestJS + Microservicios)

## Servicios

| Servicio | Responsabilidad |
|---|---|
| **auth** | Identidad, JWT, multi-tenant, CRUD de usuarios |
| **catalog** | Productos, categorías, variantes |
| **inventory** | Stock, reservas, movimientos |
| **orders** | Creación y orquestación de pedidos |
| **marketplace-integration** | Adaptador hacia APIs externas (MercadoLibre, etc.) |
| **notifications** | Reacciona a eventos (email, webhooks) |
| **gateway** | API Gateway, único punto de entrada externo |

## Atributos de calidad

1. **Disponibilidad** — un servicio caído no tumba el resto. Comunicación async con broker + circuit breaker en llamadas síncronas.
2. **Observabilidad** — sin tracing ni logs correlacionados, los microservicios son ingobernables.
3. **Flexibilidad** — agregar un canal de venta nuevo (Shopify, etc.) no debe tocar órdenes ni catálogo, solo sumar un integration service.

## Layout del proyecto

```
beaverp/
  services/
    auth/                   → proyecto NestJS independiente
    catalog/                → proyecto NestJS independiente
    inventory/
    orders/
    marketplace-integration/
    notifications/
    gateway/
```

Cada servicio es un proyecto NestJS autónomo con su propio `package.json`, `node_modules`, `nest-cli.json`. No se usa el modo monorepo de NestJS.

## Reglas de diseño (microservicios)

1. **Cada servicio con su base de datos** — ningún servicio lee o escribe directamente en la BD de otro. Si necesita datos de otro servicio, los pide por API o recibe un evento.
2. **DTO de entrada/salida** — los datos que entran y salen por API tienen su propio DTO. No se expone el schema de base de datos directamente.
3. **Comunicación síncrona (REST)** — para consultas y operaciones que necesitan respuesta inmediata. Con timeouts, sin bloqueos largos.
4. **Comunicación asíncrona (broker)** — para todo lo que cambia estado y no requiere respuesta inmediata. Usa RabbitMQ.
5. **Idempotencia** — todo consumidor de eventos debe poder recibir el mismo mensaje dos veces sin efectos duplicados.
6. **Gateway rutea, no razona** — el gateway solo enruta por ruta. No contiene lógica de negocio ni valida JWT. Cada servicio se autentica internamente.

## Estructura interna por servicio

Cada servicio se organiza por funcionalidad, sin capas forzadas:

```
src/
  *.module.ts          → módulos de NestJS
  *.controller.ts      → endpoints HTTP
  *.service.ts         → lógica del servicio
  *.schema.ts          → schema de base de datos (Mongoose)
  dto/                 → DTOs de entrada/salida
  commons/             → utilidades compartidas dentro del servicio
```

No hay separación obligatoria en domain/infra/application. NestJS se usa directo. Si en un punto concreto un patrón (repository, DIP) suma valor real, se evalúa, pero no se aplica por dogma.
