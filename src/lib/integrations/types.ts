export type ShippingQuoteRequest = {
  postalCode: string;
  items: Array<{
    sku: string;
    quantity: number;
    weightGrams?: number;
  }>;
};

export type ShippingQuote = {
  carrier: "OCA" | "CORREO_ARGENTINO" | "PICKUP";
  serviceName: string;
  serviceCode?: string;
  amount: number;
  etaLabel: string;
};

export type MercadoPagoPreferenceRequest = {
  orderNumber: string;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
  payer: {
    email: string;
  };
};

export type MercadoPagoPreferenceResponse = {
  provider: "mercadopago";
  preferenceId: string;
  initPoint?: string;
  sandboxInitPoint?: string;
  status: "mocked" | "ready_for_live_credentials";
};
