# BEAVERP — Roadmap de Aprendizaje (Microservicios)

## Conceptos (en orden de aparición)

01. **Microservicio / Bounded Context** — qué es, cómo dividir un dominio, servicio ≠ módulo
02. **DTO y contratos entre servicios** — qué datos viajan, versionado, no exponer el schema
03. **JWT** — autenticación entre servicios, token firmado, secrets compartidos
04. **Multi-tenancy** — varios clientes, mismos servicios, datos aislados por tenant
05. **API Gateway** — punto único de entrada, enrutamiento por ruta, sin lógica de negocio
06. **Cada servicio su DB** — ownership de datos, nadie escribe en la BD de otro
07. **Comunicación síncrona (REST)** — un servicio llama a otro por HTTP
08. **Broker / RabbitMQ** — mensajería asíncrona, colas, exchanges, producers/consumers
09. **Evento de dominio** — un servicio publica que algo pasó, otros reaccionan o ignoran
10. **Consistencia eventual** — no todo está actualizado al instante, pero eventualmente sí (CAP)
11. **Saga coreografiada** — transacciones distribuidas sin coordinador, cada servicio sabe qué hacer
12. **Idempotencia** — recibir el mismo mensaje dos veces no duplica el efecto
13. **CQRS** — separar commands (escribir) de queries (leer), aunque sea a nivel de servicio
14. **Circuit Breaker** — si un servicio falla, dejar de llamarlo un rato y reintentar después
15. **Contenedores / Docker** — empaquetar, aislar y orquestar servicios para correrlos local

## Fases

| Fase | Servicios que se construyen | Conceptos nuevos |
|---|---|---|
| 0 | Auth | 1, 2, 3, 4 |
| 1 | Catalog + Inventory + Gateway | 5, 6, 7 |
| 2 | RabbitMQ (infra compartida) | 8, 9, 10 |
| 3 | Orders | 11, 12 |
| 4 | Marketplace Integration | 13, 14 |
| 5 | Notifications + Docker + Observabilidad | 15 |

### Qué se aprende en cada fase

**Fase 0 — Auth**
- Un solo microservicio con un módulo interno (auth + users)
- DTOs de entrada/salida, JWT, multi-tenancy
- Primer contacto con NestJS + Mongoose como servicio independiente

**Fase 1 — Catalog + Inventory + Gateway**
- Dos servicios nuevos, cada uno con su propia base de datos
- El gateway como punto de entrada único
- Catalog e Inventory se comunican por REST
- Se aplica ownership de datos: nadie toca la BD del otro

**Fase 2 — RabbitMQ**
- RabbitMQ como backbone de comunicación asíncrona
- Catalog publica eventos (ej: "producto creado"), Inventory consume
- Se experimenta con consistencia eventual

**Fase 3 — Orders**
- Orquestación de pedidos que cruzan Catalog + Inventory + Auth
- Saga coreografiada para mantener consistencia sin transacción distribuida
- Idempotencia en cada consumidor de eventos

**Fase 4 — Marketplace Integration**
- Adaptador hacia APIs externas (MercadoLibre)
- CQRS: commands para escribir, queries para leer
- Circuit breaker para no saturar APIs externas caídas

**Fase 5 — Notifications + Docker + Observabilidad**
- Notifications reacciona a eventos (email, webhooks)
- Docker Compose para correr todo localmente
- Logs correlacionados, health checks, tracing básico

## Notas

- No se usa Clean Architecture ni capas forzadas (domain/infra/application). NestJS se usa directo.
- No se exige TDD. Los tests vienen después si se necesitan.
- El foco es entender los patrones de microservicios: comunicación, ownership, resiliencia, contenedores.
- Cada fase asume que ya corriste y entendiste la anterior. No se saltean.
