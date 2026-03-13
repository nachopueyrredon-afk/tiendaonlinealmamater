import type { MercadoPagoPreferenceRequest, MercadoPagoPreferenceResponse } from "@/lib/integrations/types";

export async function createMercadoPagoPreference(
  payload: MercadoPagoPreferenceRequest
): Promise<MercadoPagoPreferenceResponse> {
  return {
    provider: "mercadopago",
    preferenceId: `mock-${payload.orderNumber}`,
    status: process.env.MERCADOPAGO_ACCESS_TOKEN ? "mocked" : "ready_for_live_credentials",
  };
}
