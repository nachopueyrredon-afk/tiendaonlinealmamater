# ALMA MATER ecommerce

Base full-stack para una tienda online DTC en Argentina con dos lineas de producto: imagenes religiosas en resina epoxi y joyeria religiosa.

## Stack

- Next.js 15 + TypeScript
- PostgreSQL + Prisma ORM
- Tailwind CSS
- Auth.js preparado para admin
- Integraciones tipadas preparadas para Mercado Pago, OCA y Correo Argentino

## Estado actual

- Arquitectura inicial definida en `docs/architecture.md`
- Schema relacional en `prisma/schema.prisma`
- Seeds demo de productos, catalogo y una orden en `prisma/seed.ts`
- Storefront inicial con home, catalogo, producto, carrito, checkout y paginas institucionales
- Backoffice inicial con auth por credenciales, dashboard, productos, pedidos y contenido
- Paginas institucionales editables desde admin mediante base de datos
- SEO tecnico base con metadata, `src/app/robots.ts` y `src/app/sitemap.ts`
- Trazabilidad de diseno documentada en `docs/stitch-traceability.md`
- Persistencia real de checkout via `POST /api/checkout`

## Requisito pendiente

Google Stitch via MCP no estaba expuesto en este entorno durante esta iteracion. La integracion visual definitiva queda pendiente de esa herramienta para completar el flujo exigido de direccion de arte y trazabilidad final.

## Variables de entorno

Copiar `.env.example` a `.env` y completar:

```bash
cp .env.example .env
```

Campos principales:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `MERCADOPAGO_ACCESS_TOKEN`
- `OCA_API_URL`
- `OCA_API_KEY`
- `CORREO_ARGENTINO_API_URL`
- `CORREO_ARGENTINO_API_KEY`

## Desarrollo local

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Credenciales admin seed por defecto:

- email: `admin@almamater.com`
- password: `change-me`

Conviene cambiarlas en `./.env` antes de produccion y volver a correr `npm run prisma:seed`.

## Publicacion en GitHub

Este proyecto se publica desde el repo raiz `Antigravity`, pero el remoto de GitHub recibe solo `Tiendaonlinealmamater` via subtree.

Revision rapida del estado local:

```bash
./scripts/status.sh
```

Publicar avances al repo `nachopueyrredon-afk/tiendaonlinealmamater`:

```bash
./scripts/publish.sh "mensaje del commit"
```

Ese comando:

- stagea solo `Tiendaonlinealmamater`
- crea el commit en el repo raiz si hay cambios nuevos del proyecto
- hace `git subtree push` al remoto de GitHub de la tienda

Tip rapido: si queres revisar antes de publicar, corre `./scripts/status.sh` y despues `./scripts/publish.sh "mensaje del commit"`.

## Modulos previstos

1. Catalogo y variantes
2. Pricing con doble precio
3. Checkout y envios
4. Pedidos y pagos
5. Admin y CMS liviano
6. SEO tecnico
7. Integraciones externas

## Pendientes reales por credenciales externas

- Mercado Pago: credenciales, webhook y preferencia real
- OCA: credenciales y contrato operativo
- Correo Argentino: credenciales y formato real de cotizacion/tracking
- Object storage: bucket, region y llaves
- Email transaccional

## Checklist QA inicial

- [ ] Crear base PostgreSQL local
- [ ] Ejecutar migraciones Prisma
- [ ] Correr seeds
- [ ] Validar home responsive
- [ ] Validar filtros de catalogo
- [ ] Validar precio regular y transferencia en producto/checkout
- [ ] Validar estados de pedido en admin
- [ ] Integrar credenciales externas
- [ ] Completar direccion visual final con Google Stitch via MCP
