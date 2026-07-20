# BEAVERP — Roadmap y Plan de Implementación

Este documento define el plan de implementación inmediato y las fases de desarrollo para construir el MVP (Monolito Modular) y su futura migración a microservicios.

## Plan de Implementación (MVP - Monolito Modular)
Guía compacta, ordenada y accionable para comenzar el desarrollo **HOY**. Marca los pasos conforme se avancen:

- [ ] **Paso 1: Setup Inicial Core**
  - Inicializar la app base en NestJS (`beaverp`).
  - Configurar las variables de entorno (`.env`) y conexión a Base de Datos (ORM/ODM).
  - Instalar dependencias globales y configurar `EventEmitter2` (para comunicación entre módulos).
- [ ] **Paso 2: Seguridad y Multi-tenant (Módulo Auth)**
  - Implementar login, validación de JWT y Guards.
  - Definir la estrategia Multi-tenant (asegurar que cada request extraiga y valide el `tenant_id`).
- [ ] **Paso 3: Dominios Base (Catalog, Customers, Inventory)**
  - Crear la estructura de capas (Controller -> Service -> Repository) para cada uno.
  - Implementar CRUD de Clientes (**Customers**).
  - Implementar CRUD de Productos y Variantes (**Catalog**).
  - Implementar lógica básica de Entradas/Salidas de Stock (**Inventory**).
- [ ] **Paso 4: Orquestación del Pedido (Módulo Orders)**
  - Desarrollar la creación de la Orden.
  - **Crucial:** Implementar el bajo acoplamiento. Al crear una orden, emitir evento `order.created`.
  - El módulo **Inventory** debe escuchar `order.created` de forma asíncrona (local) y descontar el stock.
- [ ] **Paso 5: Canales y Alertas (Marketplace & Notifications)**
  - Crear el adaptador de **Marketplace** para recibir órdenes simuladas de canales externos.
  - Crear el módulo de **Notifications** que escuche eventos (ej. `order.paid`) y mande alertas/emails.

---

## FASE 1: Construcción del Monolito MVP (Contexto Arquitectónico)
- **Objetivo:** Lanzar un sistema funcional de inmediato, cuidando la calidad para poder escalar.
- **Reglas del Juego:** DTOs estrictos por módulo, sin dependencias cruzadas de base de datos. Si el módulo A necesita algo del módulo B, pide los datos mediante el Service de B o se avisan mediante Eventos.

## FASE 2: Migración a Microservicios (El Futuro)
- **Objetivo:** Desacoplar por completo la infraestructura para escalar módulos (ej. escalar solo "Orders" en Black Friday).
- **Hitos de Migración:**
  1. Separar el **API Gateway** y el microservicio de **Auth**.
  2. Implementar **RabbitMQ** para reemplazar a `EventEmitter2`.
  3. Desplegar bases de datos físicas separadas para cada microservicio.
  4. Extraer Catalog, Inventory y Orders en procesos (contenedores) separados.
  5. Manejar fallos con **Sagas Coreografiadas** y Circuit Breakers.
  6. Implementar **Observabilidad** (Tracing distribuido, logs centralizados).

## Directivas para Agentes
- Consultar siempre la lista del **Plan de Implementación** para saber exactamente qué paso construir.
- Mantener la disciplina del bajo acoplamiento en la Fase 1. No tomar atajos arquitectónicos que rompan los límites de cada módulo.
