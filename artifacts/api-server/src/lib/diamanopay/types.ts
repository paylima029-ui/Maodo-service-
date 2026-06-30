export type PaymentMethod = "WAVE" | "ORANGE_MONEY" | "FREE_MONEY" | "EXPRESSO";

export interface DiamanoPayTokenResponse {
  accessToken: string;
  tokenType?: string;
  expiresIn?: number;
}

export interface DiamanoPayCreateChargeRequest {
  amount: number;
  provider: PaymentMethod;
  description: string;
  clientReference: string;
  redirectUrl: string;
  webhook: string;
  feeOnCustomer?: boolean;
  extraData?: Record<string, unknown>;
}

export interface DiamanoPayCreateChargeResponse {
  chargeId?: string;
  id?: string;
  transactionId?: string;
  status?: DiamanoPayTransactionStatus;
  paymentUrl?: string;
  payment_url?: string;
  link?: string;
  url?: string;
  checkoutUrl?: string;
  checkout_url?: string;
  qrCodeData?: string;
  qrCode?: string;
  qr_code?: string;
  qrCodeUrl?: string;
  expiresAt?: string;
  reference?: string;
  clientReference?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export type DiamanoPayTransactionStatus =
  | "PENDING"
  | "PROCESSING"
  | "SUCCEEDED"
  | "FAILED"
  | "CANCELLED"
  | "EXPIRED"
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | "cancelled"
  | "expired";

export interface DiamanoPayTransactionResponse {
  transactionId: string;
  paymentRequestId?: string;
  status: DiamanoPayTransactionStatus;
  paymentService?: string;
  amount?: number;
  clientReference?: string;
  createdAt?: string;
}

export interface DiamanoPayWebhookPayload {
  id?: string;
  transactionId?: string;
  transaction_id?: string;
  paymentRequestId?: string;
  chargeId?: string;
  status: string;
  paymentService?: string;
  amount?: number;
  clientReference?: string;
  client_reference?: string;
  reference?: string;
  signature?: string;
  [key: string]: unknown;
}

export interface DiamanoPayChargeStatusResponse {
  id?: string;
  chargeId?: string;
  transactionId?: string;
  status: string;
  amount?: number;
  clientReference?: string;
  client_reference?: string;
  paymentService?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface DiamanoPayCallbackPayload {
  transactionId?: string;
  transaction_id?: string;
  chargeId?: string;
  status: string;
}

export interface DiamanoPayError {
  code?: string;
  message: string;
  details?: unknown;
}
