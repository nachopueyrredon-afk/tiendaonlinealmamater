{\rtf1\ansi\ansicpg1252\cocoartf2869
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 # ALMA MATER \'97 Reglas funcionales del ecommerce\
\
## Objetivo\
Este documento define la l\'f3gica funcional m\'ednima que el ecommerce debe resolver para ser realmente operable.\
\
---\
\
## 1. Cat\'e1logo\
\
### Estructura m\'ednima\
El sistema debe soportar:\
- productos\
- variantes\
- categor\'edas\
- colecciones\
- materiales\
- advocaciones\
- atributos\
- im\'e1genes\
- stock\
- precios\
\
### Tipos de producto\
Debe contemplar al menos:\
1. im\'e1genes religiosas en resina epoxi\
2. joyer\'eda religiosa\
\
### Variantes\
Cuando corresponda, un producto puede tener variantes por:\
- material\
- tama\'f1o\
- terminaci\'f3n\
- advocaci\'f3n\
\
No asumir que todos los productos usan el mismo esquema de variantes.\
\
---\
\
## 2. Precios\
\
### Regla comercial obligatoria\
Cada producto debe poder mostrar:\
- **precio regular**\
- **precio con descuento por transferencia**\
\
Ambos precios deben poder configurarse desde admin.\
\
### Requisitos\
- el precio por transferencia debe ser editable\
- debe poder mostrarse el ahorro\
- debe poder mostrarse en cat\'e1logo y producto\
- debe persistirse correctamente en la orden seg\'fan el medio elegido\
\
### Cuotas\
El sistema debe contemplar:\
- visualizaci\'f3n de cuotas\
- integraci\'f3n preparada para Mercado Pago\
- claridad de precio financiado si aplica\
\
---\
\
## 3. Stock\
\
### Requisitos\
Debe existir stock:\
- por producto\
- o por variante, cuando aplique\
\
### Reglas\
- si no hay stock, el producto debe marcarse como sin stock\
- el admin debe poder editar stock f\'e1cil\
- el sitio debe impedir compra inv\'e1lida si el stock es insuficiente\
- la orden debe descontar stock correctamente\
\
---\
\
## 4. Checkout\
\
### El checkout debe resolver\
- identificaci\'f3n del cliente\
- direcci\'f3n\
- env\'edo\
- medio de pago\
- resumen de compra\
- validaci\'f3n final\
\
### El usuario debe ver claramente\
- subtotal\
- costo de env\'edo\
- total\
- precio regular\
- descuento por transferencia si corresponde\
- cuotas si aplica\
\
---\
\
## 5. Pagos\
\
### Integraci\'f3n requerida\
Preparar integraci\'f3n con **Mercado Pago**.\
\
### El sistema debe soportar\
- pago online\
- transferencia\
- registro del medio de pago\
- estado del pago\
- posibilidad de registrar pago manual desde admin si hace falta\
\
### Estados sugeridos\
- pendiente\
- pagado\
- rechazado\
- vencido\
- manual a verificar\
\
---\
\
## 6. Env\'edos\
\
### Integraciones requeridas\
- OCA\
- Correo Argentino\
\
### Requisitos funcionales\
El cliente debe poder:\
- ingresar c\'f3digo postal\
- cotizar env\'edo en tiempo real\
- elegir m\'e9todo de env\'edo\
\
El sistema debe guardar:\
- carrier\
- m\'e9todo\
- costo\
- tracking si existe\
\
### Alternativas\
Evaluar tambi\'e9n:\
- retiro en punto\
- retiro en sucursal\
- retiro acordado\
\
---\
\
## 7. Pedidos\
\
### El sistema debe soportar\
- creaci\'f3n de orden\
- items por orden\
- snapshot del precio al momento de la compra\
- estado del pedido\
- estado del pago\
- estado del env\'edo\
- datos del cliente\
- direcci\'f3n de entrega\
- tracking\
\
### Estados sugeridos de pedido\
- pendiente\
- confirmado\
- en preparaci\'f3n\
- despachado\
- entregado\
- cancelado\
\
---\
\
## 8. Panel de administraci\'f3n\
\
### Gesti\'f3n de productos\
Debe permitir:\
- crear\
- editar\
- duplicar\
- publicar\
- despublicar\
- subir im\'e1genes\
- ordenar im\'e1genes\
- configurar categor\'edas\
- configurar materiales\
- configurar advocaciones\
- configurar variantes\
- actualizar precios\
- actualizar precio transferencia\
- actualizar stock\
\
### Gesti\'f3n comercial\
Debe permitir:\
- ver pedidos\
- cambiar estados\
- registrar pagos manuales\
- cargar tracking\
- ver clientes\
- exportar pedidos\
\
### Gesti\'f3n de contenido\
Debe permitir:\
- editar home\
- destacar productos\
- administrar banners o bloques\
- SEO b\'e1sico por producto y categor\'eda\
\
---\
\
## 9. SEO y contenido\
\
### SEO m\'ednimo requerido\
- URLs limpias\
- metadata\
- Open Graph\
- sitemap\
- robots\
- canonical\
- schema de producto\
\
### Contenido institucional m\'ednimo\
- Nosotros\
- Env\'edos\
- Medios de pago\
- Cambios y devoluciones\
- Contacto\
- FAQ\
- Pol\'edticas\
\
---\
\
## 10. Base de datos\
\
### Recomendaci\'f3n\
Priorizar **PostgreSQL**.\
\
### Motivo\
Este negocio requiere una estructura consistente para:\
- cat\'e1logo con relaciones claras\
- variantes\
- stock\
- \'f3rdenes\
- pagos\
- env\'edos\
- descuentos\
- integridad de datos\
\
MongoDB no es la mejor primera opci\'f3n para este caso, salvo justificaci\'f3n t\'e9cnica fuerte.\
\
---\
\
## 11. Seeds iniciales\
Cargar como m\'ednimo:\
- 3 productos de im\'e1genes religiosas\
- varios productos demo de joyer\'eda\
- materiales\
- advocaciones\
- categor\'edas\
- colecciones\
- im\'e1genes demo o assets disponibles\
\
---\
\
## 12. Criterio de implementaci\'f3n\
No construir:\
- una demo de UI sin l\'f3gica real\
- un mock sin backoffice\
- un frontend lindo sin operaci\'f3n\
- una arquitectura fr\'e1gil\
\
S\'ed construir:\
- una base real para vender\
- una estructura mantenible\
- una operaci\'f3n diaria simple\
- una experiencia visual muy cuidada}