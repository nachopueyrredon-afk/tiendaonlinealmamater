import { AdminRole, PrismaClient, ProductLine, ProductStatus, ShippingCarrier, PaymentMethod, PaymentStatus, ShipmentStatus, OrderStatus, DiscountType, InventoryPolicy, HomeBlockType } from "@prisma/client";
import bcrypt from "bcryptjs";

import { getSeedAdminPassword } from "../src/lib/security-env";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(getSeedAdminPassword(), 10);

  await prisma.adminUser.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@almamater.com" },
    update: { passwordHash },
    create: {
      email: process.env.ADMIN_EMAIL || "admin@almamater.com",
      name: "ALMA MATER Admin",
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  const [imagesCategory, jewelryCategory, medalsCollection, giftsCollection, silver, silverGold, silverGoldEnamel, virgenMilagrosa, sanBenito] = await Promise.all([
    prisma.category.upsert({ where: { slug: "imagenes-religiosas" }, update: {}, create: { name: "Imagenes religiosas", slug: "imagenes-religiosas", description: "Esculturas en resina epoxi" } }),
    prisma.category.upsert({ where: { slug: "joyeria-religiosa" }, update: {}, create: { name: "Joyeria religiosa", slug: "joyeria-religiosa", description: "Medallas, dijes y piezas devocionales" } }),
    prisma.collection.upsert({ where: { slug: "medallas-significativas" }, update: {}, create: { name: "Medallas significativas", slug: "medallas-significativas", isFeatured: true } }),
    prisma.collection.upsert({ where: { slug: "regalos-con-sentido" }, update: {}, create: { name: "Regalos con sentido", slug: "regalos-con-sentido", isFeatured: true } }),
    prisma.material.upsert({ where: { slug: "plata" }, update: {}, create: { name: "Plata", slug: "plata" } }),
    prisma.material.upsert({ where: { slug: "plata-y-oro" }, update: {}, create: { name: "Plata y oro", slug: "plata-y-oro" } }),
    prisma.material.upsert({ where: { slug: "plata-oro-esmalte" }, update: {}, create: { name: "Plata + oro + esmalte", slug: "plata-oro-esmalte" } }),
    prisma.devotion.upsert({ where: { slug: "virgen-milagrosa" }, update: {}, create: { name: "Virgen Milagrosa", slug: "virgen-milagrosa" } }),
    prisma.devotion.upsert({ where: { slug: "san-benito" }, update: {}, create: { name: "San Benito", slug: "san-benito" } }),
  ]);

  const products = [
    {
      name: "Virgen de la Dulce Espera",
      slug: "virgen-dulce-espera-resina",
      description: "Imagen en resina epoxi pensada para espacios de contemplacion y regalo significativo.",
      line: ProductLine.RESINA_EPOXI,
      sku: "AM-IMG-001",
      regularPrice: 185000,
      transferPrice: 166500,
      baseStock: 6,
      installmentsText: "Hasta 6 cuotas sin interes segun promocion vigente.",
      dimensions: "28 x 12 x 10 cm",
      weightGrams: 1300,
      careInstructions: "Limpiar con pano seco y evitar sol directo prolongado.",
      categories: [imagesCategory.id],
      collections: [giftsCollection.id],
      materials: [],
      devotions: [],
    },
    {
      name: "Sagrada Familia en resina",
      slug: "sagrada-familia-resina",
      description: "Pieza escultorica de tono sereno para hogar, altar o regalo de nacimiento.",
      line: ProductLine.RESINA_EPOXI,
      sku: "AM-IMG-002",
      regularPrice: 209000,
      transferPrice: 188100,
      baseStock: 4,
      installmentsText: "Hasta 6 cuotas sin interes segun promocion vigente.",
      dimensions: "30 x 14 x 12 cm",
      weightGrams: 1450,
      careInstructions: "Limpiar con pano seco y guardar en su caja al trasladar.",
      categories: [imagesCategory.id],
      collections: [giftsCollection.id],
      materials: [],
      devotions: [],
    },
    {
      name: "Virgen de Lourdes en resina",
      slug: "virgen-lourdes-resina",
      description: "Imagen de presencia limpia y vertical, con lectura contemporanea y terminacion cuidada.",
      line: ProductLine.RESINA_EPOXI,
      sku: "AM-IMG-003",
      regularPrice: 178000,
      transferPrice: 160200,
      baseStock: 5,
      installmentsText: "Hasta 6 cuotas sin interes segun promocion vigente.",
      dimensions: "26 x 11 x 9 cm",
      weightGrams: 1180,
      careInstructions: "No usar abrasivos ni exponer a humedad intensa.",
      categories: [imagesCategory.id],
      collections: [giftsCollection.id],
      materials: [],
      devotions: [],
    },
    {
      name: "Medalla Virgen Milagrosa oval",
      slug: "medalla-virgen-milagrosa-oval",
      description: "Medalla de lectura delicada para uso cotidiano o regalo de bautismo.",
      line: ProductLine.JOYERIA,
      sku: "AM-JOY-001",
      regularPrice: 92000,
      transferPrice: 82800,
      baseStock: 0,
      installmentsText: "Hasta 3 cuotas sin interes con Mercado Pago.",
      dimensions: "2.2 x 1.6 cm",
      weightGrams: 12,
      careInstructions: "Guardar seca y evitar perfumes directos.",
      categories: [jewelryCategory.id],
      collections: [medalsCollection.id, giftsCollection.id],
      materials: [silver.id, silverGold.id, silverGoldEnamel.id],
      devotions: [virgenMilagrosa.id],
      variants: [
        { name: "Plata", sku: "AM-JOY-001-PL", regularPrice: 92000, transferPrice: 82800, stock: 8, materialId: silver.id, devotionId: virgenMilagrosa.id },
        { name: "Plata y oro", sku: "AM-JOY-001-PO", regularPrice: 124000, transferPrice: 111600, stock: 4, materialId: silverGold.id, devotionId: virgenMilagrosa.id },
        { name: "Plata, oro y esmalte", sku: "AM-JOY-001-PGE", regularPrice: 141000, transferPrice: 126900, stock: 2, materialId: silverGoldEnamel.id, devotionId: virgenMilagrosa.id },
      ],
    },
    {
      name: "Medalla San Benito circular",
      slug: "medalla-san-benito-circular",
      description: "Pieza de mayor presencia para quienes buscan proteccion y simbolo en una joya noble.",
      line: ProductLine.JOYERIA,
      sku: "AM-JOY-002",
      regularPrice: 98000,
      transferPrice: 88200,
      baseStock: 0,
      installmentsText: "Hasta 3 cuotas sin interes con Mercado Pago.",
      dimensions: "2.5 x 2.5 cm",
      weightGrams: 15,
      careInstructions: "Evitar golpes y contacto con productos abrasivos.",
      categories: [jewelryCategory.id],
      collections: [medalsCollection.id],
      materials: [silver.id, silverGold.id],
      devotions: [sanBenito.id],
      variants: [
        { name: "Plata", sku: "AM-JOY-002-PL", regularPrice: 98000, transferPrice: 88200, stock: 9, materialId: silver.id, devotionId: sanBenito.id },
        { name: "Plata y oro", sku: "AM-JOY-002-PO", regularPrice: 129000, transferPrice: 116100, stock: 3, materialId: silverGold.id, devotionId: sanBenito.id },
      ],
    },
  ];

  for (const item of products) {
    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        line: item.line,
        status: ProductStatus.PUBLISHED,
        sku: item.sku,
        regularPrice: item.regularPrice,
        transferPrice: item.transferPrice,
        installmentsText: item.installmentsText,
        dimensions: item.dimensions,
        weightGrams: item.weightGrams,
        careInstructions: item.careInstructions,
        inventoryPolicy: InventoryPolicy.DENY,
        isFeatured: true,
      },
      create: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        line: item.line,
        status: ProductStatus.PUBLISHED,
        sku: item.sku,
        regularPrice: item.regularPrice,
        transferPrice: item.transferPrice,
        installmentsText: item.installmentsText,
        dimensions: item.dimensions,
        weightGrams: item.weightGrams,
        careInstructions: item.careInstructions,
        inventoryPolicy: InventoryPolicy.DENY,
        isFeatured: true,
      },
    });

    await prisma.productCategory.deleteMany({ where: { productId: product.id } });
    await prisma.productCollection.deleteMany({ where: { productId: product.id } });
    await prisma.productMaterial.deleteMany({ where: { productId: product.id } });
    await prisma.productDevotion.deleteMany({ where: { productId: product.id } });
    await prisma.productVariant.deleteMany({ where: { productId: product.id } });

    await prisma.productCategory.createMany({ data: item.categories.map((categoryId) => ({ productId: product.id, categoryId })) });
    await prisma.productCollection.createMany({ data: item.collections.map((collectionId) => ({ productId: product.id, collectionId })) });

    if (item.materials.length) {
      await prisma.productMaterial.createMany({ data: item.materials.map((materialId) => ({ productId: product.id, materialId })) });
    }

    if (item.devotions.length) {
      await prisma.productDevotion.createMany({ data: item.devotions.map((devotionId) => ({ productId: product.id, devotionId })) });
    }

    if ("variants" in item && item.variants) {
      await prisma.productVariant.createMany({
        data: item.variants.map((variant, index) => ({
          productId: product.id,
          name: variant.name,
          sku: variant.sku,
          regularPrice: variant.regularPrice,
          transferPrice: variant.transferPrice,
          stock: variant.stock,
          materialId: variant.materialId,
          devotionId: variant.devotionId,
          sortOrder: index,
          isDefault: index === 0,
        })),
      });
    }
  }

  await prisma.shippingMethod.upsert({
    where: { slug: "oca-domicilio" },
    update: {},
    create: { name: "OCA a domicilio", slug: "oca-domicilio", carrier: ShippingCarrier.OCA, basePrice: 6900 },
  });

  await prisma.shippingMethod.upsert({
    where: { slug: "correo-argentino-domicilio" },
    update: {},
    create: { name: "Correo Argentino a domicilio", slug: "correo-argentino-domicilio", carrier: ShippingCarrier.CORREO_ARGENTINO, basePrice: 6400 },
  });

  await prisma.coupon.upsert({
    where: { code: "BIENVENIDA" },
    update: {},
    create: { code: "BIENVENIDA", description: "Cupon de ejemplo para la primera compra", type: DiscountType.PERCENTAGE, value: 10 },
  });

  await prisma.homeBlock.upsert({
    where: { key: "home-hero" },
    update: {},
    create: {
      key: "home-hero",
      type: HomeBlockType.HERO,
      title: "Objetos religiosos contemporaneos",
      subtitle: "El arte de creer",
      content: {
        eyebrow: "ALMA MATER",
        primaryCta: { label: "Explorar catalogo", href: "/catalogo" },
        secondaryCta: { label: "Regalos con sentido", href: "/colecciones/regalos-con-sentido" }
      }
    },
  });

  await prisma.homeBlock.upsert({
    where: { key: "home-brand-story" },
    update: {},
    create: {
      key: "home-brand-story",
      type: HomeBlockType.RICH_TEXT,
      title: "Una experiencia de compra mas cercana al objeto que a la oferta.",
      subtitle: "El home evita el tono de marketplace y trabaja un ritmo contemplativo.",
      content: {
        eyebrow: "La marca",
        items: [
          {
            title: "Imagenes religiosas",
            description: "Esculturas en resina epoxi con presencia serena, materialidad noble y lenguaje contemporaneo.",
            note: "Piezas para hogar, regalo y contemplacion"
          },
          {
            title: "Joyeria con sentido",
            description: "Piezas en plata, oro y esmalte que trabajan advocaciones con una lectura mas refinada que devocional.",
            note: "Uso cotidiano con valor simbolico y material"
          },
          {
            title: "Operacion real",
            description: "Catalogo, stock, pedidos, doble precio, pagos y envios pensados para vender de verdad.",
            note: "Base comercial lista para crecer"
          }
        ]
      },
      sortOrder: 10,
    },
  });

  await prisma.homeBlock.upsert({
    where: { key: "home-editorial-band" },
    update: {},
    create: {
      key: "home-editorial-band",
      type: HomeBlockType.RICH_TEXT,
      title: "Regalos con sentido, piezas de hogar y joyeria devocional con una lectura mas actual.",
      subtitle: "Mucho aire, menos bloques, mejor jerarquia.",
      content: {
        leftEyebrow: "Curaduria",
        rightEyebrow: "Criterio visual",
        rightBody: "El producto lidera y la informacion comercial aparece con precision, sin perder calidez ni valor de marca."
      },
      sortOrder: 20,
    },
  });

  await prisma.homeBlock.upsert({
    where: { key: "home-operational-band" },
    update: {},
    create: {
      key: "home-operational-band",
      type: HomeBlockType.RICH_TEXT,
      title: "Una tienda contemplativa en lenguaje visual, pero rigurosa en operacion comercial, stock, pedidos y backoffice.",
      subtitle: "El siguiente salto natural es terminar la capa transaccional con Mercado Pago y afinar el sistema visual final con los assets reales de marca.",
      content: {
        eyebrow: "Base operativa",
        cardEyebrow: "Acceso rapido",
        cardTitle: "Backoffice conectado a Supabase y listo para seguir creciendo.",
        cardCtaLabel: "Ver backoffice",
        cardCtaHref: "/admin"
      },
      sortOrder: 30,
    },
  });

  const sitePages = [
    {
      slug: "nosotros",
      title: "Nosotros",
      body: "ALMA MATER nace para dar forma a objetos religiosos contemporaneos, sobrios y significativos. La marca trabaja el cruce entre espiritualidad, diseno, materialidad y experiencia de regalo con una sensibilidad editorial, sin estetica barroca ni lenguaje de marketplace.",
      seoDescription: "La marca combina espiritualidad, diseno contemporaneo y valor de objeto.",
    },
    {
      slug: "envios",
      title: "Envios",
      body: "El checkout queda preparado para cotizar envios por codigo postal y guardar carrier, metodo, costo y tracking. La integracion esta modelada para OCA y Correo Argentino, con opcion adicional de retiro acordado cuando corresponda.",
      seoDescription: "Integracion preparada para OCA y Correo Argentino con cotizacion por codigo postal.",
    },
    {
      slug: "medios-de-pago",
      title: "Medios de pago",
      body: "Cada producto comunica precio regular y precio con descuento por transferencia. La plataforma queda preparada para Mercado Pago, cuotas y registro del medio elegido en la orden. El admin tambien puede registrar pagos manuales cuando la operatoria lo requiera.",
      seoDescription: "Doble precio, ahorro por transferencia y preparacion para Mercado Pago.",
    },
    {
      slug: "cambios-y-devoluciones",
      title: "Cambios y devoluciones",
      body: "La tienda queda preparada para publicar politicas claras sobre cambios, devoluciones y piezas danadas en el traslado. Se prioriza una comunicacion sobria, simple y confiable, alineada con el tono general de la marca.",
      seoDescription: "Politica clara para resolver cambios o incidencias con confianza.",
    },
    {
      slug: "contacto",
      title: "Contacto",
      body: "La experiencia contempla un canal claro para consultas sobre producto, medios de pago, envios, tracking y compras mayoristas o institucionales. Se puede extender con formulario, WhatsApp y respuestas operativas desde admin o email transaccional.",
      seoDescription: "Canales de contacto claros para consultas comerciales y seguimiento.",
    },
    {
      slug: "faq",
      title: "FAQ",
      body: "Como se informa el precio? Cada ficha muestra precio regular y precio con descuento por transferencia, con ahorro visible.\n\nPuedo pagar en cuotas? Si. La tienda queda preparada para Mercado Pago y para mostrar cuotas por producto.\n\nSe puede cotizar envio antes de pagar? Si. El checkout contempla cotizacion por codigo postal y seleccion de metodo.\n\nComo se controla el stock? La operacion contempla stock por producto o por variante, segun el tipo de pieza.",
      seoDescription: "Preguntas frecuentes sobre stock, pagos, envios y cuidados de producto.",
    },
    {
      slug: "privacidad",
      title: "Politica de privacidad y terminos",
      body: "La tienda queda preparada para publicar bases de tratamiento de datos, terminos comerciales, tiempos de despacho, uso de cookies y responsabilidades sobre integraciones de pago y envio. Esta pagina debe completarse con el texto legal definitivo antes de salir a produccion.",
      seoDescription: "Politica de privacidad, uso de datos y terminos generales.",
    },
  ];

  for (const page of sitePages) {
    await prisma.sitePage.upsert({
      where: { slug: page.slug },
      update: page,
      create: page,
    });
  }

  const customer = await prisma.customer.upsert({
    where: { email: "cliente.demo@almamater.com" },
    update: {},
    create: { email: "cliente.demo@almamater.com", firstName: "Clara", lastName: "Aguirre", phone: "+54 9 11 5555 0101" },
  });

  await prisma.address.deleteMany({ where: { customerId: customer.id } });

  const address = await prisma.address.create({
    data: {
      customerId: customer.id,
      label: "Casa",
      firstName: "Clara",
      lastName: "Aguirre",
      line1: "Av. del Libertador 2400",
      city: "Buenos Aires",
      province: "Buenos Aires",
      postalCode: "1425",
      phone: "+54 9 11 5555 0101",
    },
  });

  const featuredProduct = await prisma.product.findFirstOrThrow({ where: { slug: "medalla-virgen-milagrosa-oval" } });

  await prisma.order.deleteMany({ where: { orderNumber: "AM-1001" } });

  const order = await prisma.order.create({
    data: {
      orderNumber: "AM-1001",
      customerId: customer.id,
      email: customer.email,
      status: OrderStatus.CONFIRMED,
      paymentStatus: PaymentStatus.PAID,
      shippingStatus: ShipmentStatus.READY,
      paymentMethod: PaymentMethod.MERCADO_PAGO,
      billingAddressId: address.id,
      shippingAddressId: address.id,
      subtotal: featuredProduct.regularPrice,
      shippingTotal: 6400,
      total: featuredProduct.regularPrice + 6400,
      transferSavings: featuredProduct.regularPrice - featuredProduct.transferPrice,
      items: {
        create: {
          productId: featuredProduct.id,
          productNameSnapshot: featuredProduct.name,
          skuSnapshot: featuredProduct.sku,
          quantity: 1,
          unitRegularPrice: featuredProduct.regularPrice,
          unitTransferPrice: featuredProduct.transferPrice,
          lineTotal: featuredProduct.regularPrice,
        },
      },
      payments: {
        create: {
          provider: "mercadopago",
          method: PaymentMethod.MERCADO_PAGO,
          status: PaymentStatus.PAID,
          amount: featuredProduct.regularPrice + 6400,
        },
      },
      shipments: {
        create: {
          carrier: ShippingCarrier.CORREO_ARGENTINO,
          serviceName: "Correo Argentino a domicilio",
          cost: 6400,
          postalCode: address.postalCode,
          status: ShipmentStatus.READY,
        },
      },
    },
  });

  console.log(`Seed OK: ${order.orderNumber}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
