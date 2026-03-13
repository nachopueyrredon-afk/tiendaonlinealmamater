import type { ShippingQuote, ShippingQuoteRequest } from "@/lib/integrations/types";

export async function quoteShipping(payload: ShippingQuoteRequest): Promise<ShippingQuote[]> {
  const hasHeavyItems = payload.items.some((item) => (item.weightGrams || 0) > 1000);

  return [
    {
      carrier: "CORREO_ARGENTINO",
      serviceName: "Correo Argentino a domicilio",
      serviceCode: "ca-home",
      amount: hasHeavyItems ? 7900 : 6400,
      etaLabel: "3 a 6 dias habiles",
    },
    {
      carrier: "OCA",
      serviceName: "OCA a domicilio",
      serviceCode: "oca-home",
      amount: hasHeavyItems ? 8400 : 6900,
      etaLabel: "2 a 5 dias habiles",
    },
    {
      carrier: "PICKUP",
      serviceName: "Retiro acordado",
      amount: 0,
      etaLabel: "Coordinacion manual",
    },
  ];
}
