# QA checklist

## Validaciones realizadas

- Build de Next.js exitoso con `npm run build`
- Navegacion publica compilada: home, catalogo, producto, carrito, checkout e institucionales
- Backoffice compilado: panel, productos, pedidos y contenido
- SEO tecnico base compilado: sitemap y robots

## Validaciones pendientes

- Configurar `DATABASE_URL` real y correr `prisma validate`, migraciones y seed
- Integrar Mercado Pago real y probar webhook
- Integrar cotizacion real con OCA y Correo Argentino
- Implementar auth real para admin
- Persistir carrito, checkout y ordenes en base de datos
- QA responsive manual con assets reales de marca
- Completar direccion visual final con Google Stitch via MCP cuando este disponible
