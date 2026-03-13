# Rutas frontend y backend

## Frontend

- `/`
- `/catalogo`
- `/producto/[slug]`
- `/carrito`
- `/checkout`
- `/cuenta`
- `/colecciones`
- `/nosotros`
- `/envios`
- `/medios-de-pago`
- `/cambios-y-devoluciones`
- `/contacto`
- `/faq`
- `/privacidad`
- `/admin`
- `/admin/productos`
- `/admin/pedidos`
- `/admin/contenido`

## Backend

- `GET /api/health`
- `POST /api/shipping/quote`
- `POST /api/payments/mercadopago/preference`
- `POST /api/payments/mercadopago/webhook`
- `GET /api/orders/export`

## Nota

Las rutas de backend quedaron listas como base tipada y documentada. Las integraciones externas reales requieren credenciales y mapeo final contra APIs productivas.
