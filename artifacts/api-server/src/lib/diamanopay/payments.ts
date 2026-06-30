import { diamanopayClient } from "./client";
import { logger } from "../logger";
import type {
  DiamanoPayCreateChargeRequest,
  DiamanoPayCreateChargeResponse,
  DiamanoPayTransactionResponse,
  DiamanoPayChargeStatusResponse,
  PaymentMethod,
} from "./types";

export const SUPPORTED_METHODS: PaymentMethod[] = [
  "WAVE",
  "ORANGE_MONEY",
  "FREE_MONEY",
  "EXPRESSO",
];

export function toPaymentMethod(raw: string): PaymentMethod {
  const map: Record<string, PaymentMethod> = {
    wave: "WAVE",
    WAVE: "WAVE",
    orange: "ORANGE_MONEY",
    orange_money: "ORANGE_MONEY",
    ORANGE_MONEY: "ORANGE_MONEY",
    free: "FREE_MONEY",
    free_money: "FREE_MONEY",
    FREE_MONEY: "FREE_MONEY",
    expresso: "EXPRESSO",
    expresso_money: "EXPRESSO",
    EXPRESSO: "EXPRESSO",
  };
  const resolved = map[raw];
  if (!resolved) throw new Error(`Unsupported payment method: ${raw}`);
  return resolved;
}

export async function createPayment(params: {
  amount: number;
  method: PaymentMethod;
  customerName: string;
  customerPhone: string;
  reference: string;
  description: string;
  appBaseUrl: string;
}): Promise<DiamanoPayCreateChargeResponse & { _debug: { redirectUrl: string; webhookUrl: string; appBase: string } }> {
  const envAppUrl = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const base = envAppUrl || params.appBaseUrl.replace(/\/$/, "");

  const redirectUrl = `${base}/payment-result?reference=${encodeURIComponent(params.reference)}`;
  const webhookUrl =
    process.env.DIAMANOPAY_WEBHOOK_URL ||
    `${base}/api/payment/webhook`;

  const payload: DiamanoPayCreateChargeRequest = {
    amount: params.amount,
    provider: params.method,
    description: params.description,
    clientReference: params.reference,
    redirectUrl,
    webhook: webhookUrl,
    feeOnCustomer: false,
  };

  const result = await diamanopayClient.post<DiamanoPayCreateChargeResponse>("/api/charges", payload);
  return { ...result, _debug: { redirectUrl, webhookUrl, appBase: base } };
}

export async function getPaymentStatus(
  chargeId: string,
): Promise<DiamanoPayTransactionResponse> {
  try {
    const charge = await diamanopayClient.get<DiamanoPayChargeStatusResponse>(
      `/api/charges/${chargeId}`,
    );
    const status =
      typeof charge.status === "string" ? charge.status : "pending";
    return {
      transactionId: charge.transactionId ?? charge.id ?? chargeId,
      status: status as DiamanoPayTransactionResponse["status"],
      clientReference: charge.clientReference ?? charge.client_reference,
      paymentService: charge.paymentService,
      amount: typeof charge.amount === "number" ? charge.amount : undefined,
    };
  } catch (err: unknown) {
    const apiErr = err as { status?: number };
    logger.warn(
      { chargeId, errStatus: apiErr.status },
      "getPaymentStatus: /api/charges failed, trying /api/transaction",
    );
    return diamanopayClient.get<DiamanoPayTransactionResponse>(
      `/api/transaction/${chargeId}`,
    );
  }
}
