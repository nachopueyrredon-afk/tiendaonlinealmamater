# ALMA MATER - arquitectura inicial

## Stack recomendado

- Next.js 15 + TypeScript para storefront, admin y server actions en una sola codebase.
- PostgreSQL + Prisma por integridad relacional, reporting futuro y baja friccion operativa.
- Tailwind CSS + componentes propios para un sistema visual editorial, sin template generico.
- Auth.js con credenciales para acceso seguro al admin.
- Integraciones desacopladas para Mercado Pago, OCA y Correo Argentino.
- Object storage compatible con S3 para imagenes y media.

## Por que PostgreSQL

- El negocio necesita relaciones fuertes entre productos, variantes, materiales, advocaciones, pedidos, pagos y envios.
- El doble precio, snapshot comercial de orden y control de stock requieren transacciones y consistencia.
- Prisma + PostgreSQL aceleran implementacion y mantenimiento sin sacrificar escalabilidad.
- Reportes, exportaciones y evolutivos comerciales se vuelven mas simples que en un modelo documental.

## Modulos

1. Catalogo: productos, variantes, imagenes, atributos, stock, categorias, colecciones, materiales y advocaciones.
2. Pricing: precio regular, precio transferencia, ahorro, cuotas, futuros cupones y promociones.
3. Checkout: identidad del cliente, direcciones, cotizacion de envio, seleccion de pago, resumen y confirmacion.
4. Order management: ordenes, items, snapshots de precio, estados de pedido, pago y envio.
5. Shipping: metodos, carriers, cotizacion, tracking y fallback manual.
6. Payments: Mercado Pago preparado, transferencia, registro manual y reconciliacion basica.
7. CMS liviano: bloques editables de home, destacados y SEO operativo.
8. Admin: CRUD de catalogo, inventario, pedidos, clientes, contenido y exportaciones.
9. SEO tecnico: metadata, Open Graph, schema.org, sitemap, robots, canonicals.

## Arquitectura de aplicacion

- `src/app/(store)` para storefront publico.
- `src/app/admin` para backoffice protegido.
- `src/lib` para dominio, utils, auth, prisma e integraciones.
- `src/features/*` para modulos verticales: catalog, checkout, orders, admin.
- `prisma/schema.prisma` como fuente de verdad del dominio.
- `prisma/seed.ts` con datos demo realistas de ALMA MATER.

## Modelo de datos

- `Product` como entidad central.
- Relaciones many-to-many con `Category`, `Collection`, `Material` y `Devotion`.
- `ProductVariant` para material, advocacion, tamano o terminacion cuando corresponda.
- `Order`, `OrderItem`, `Payment`, `Shipment` y `ShippingMethod` para la operacion comercial.
- `HomeBlock` para contenido editable del home.
- `AdminUser` para operacion interna sin CMS pesado.

## Integraciones externas

- `Mercado Pago`: crear preferencia, registrar webhook, persistir estado y referencia externa.
- `OCA` y `Correo Argentino`: adaptadores por carrier para cotizacion y tracking.
- Object storage: interfaz unica para subir y ordenar imagenes sin acoplarse a un vendor.

## Uso de Google Stitch via MCP

Secuencia planificada:

1. Analizar assets reales del workspace.
2. Pedir a Stitch dos direcciones visuales para home, catalogo, producto, checkout y admin.
3. Elegir una direccion con criterio de marca y performance.
4. Traducir decisiones a tokens, tipografias, espaciados, cards, CTA y navegacion.
5. Documentar la trazabilidad en `docs/stitch-traceability.md`.

Estado actual: la secuencia esta preparada, pero falta el nombre real del comando/herramienta MCP de Stitch en este entorno para ejecutarla.
