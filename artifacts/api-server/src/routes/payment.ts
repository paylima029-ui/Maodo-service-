import { Router, type IRouter, type Request, type Response } from "express";
import { eq } from "drizzle-orm";
import crypto from "node:crypto";
import { db, ordersTable } from "@workspace/db";
import {
  createPayment,
  getPaymentStatus,
  toPaymentMethod,
  SUPPORTED_METHODS,
} from "../lib/diamanopay";
import type { DiamanoPayWebhookPayload, DiamanoPayCallbackPayload } from "../lib/diamanopay";

const router: IRouter = Router();

function validatePhone(phone: string): boolean {
  return /^\+?[0-9\s\-()]{6,20}$/.test(phone.trim());
}

function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function isSimulationMode(): boolean {
  const flag = (process.env.DIAMANOPAY_SIMULATION ?? "").toLowerCase().trim();
  if (flag === "true" || flag === "1" || flag === "yes") return true;
  if (!process.env.DIAMANOPAY_CLIENT_ID || !process.env.DIAMANOPAY_CLIENT_SECRET) return true;
  return false;
}

function simulationRequested(): boolean {
  const flag = (process.env.DIAMANOPAY_SIMULATION ?? "").toLowerCase().trim();
  return flag === "true" || flag === "1" || flag === "yes";
}

router.post("/payment/create", async (req: Request, res: Response): Promise<void> => {
  const { orderId, method } = req.body as { orderId: number; method: string };

  if (!orderId || !method) {
    res.status(400).json({ error: "orderId et method sont requis" });
    return;
  }

  let paymentMethod;
  try {
    paymentMethod = toPaymentMethod(method);
  } catch {
    res.status(400).json({
      error: `Méthode de paiement invalide. Méthodes supportées: ${SUPPORTED_METHODS.join(", ")}`,
    });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, orderId));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  if (order.paymentStatus === "paid") {
    res.status(409).json({ error: "Cette commande a déjà été payée" });
    return;
  }

  if (!validatePhone(order.clientPhone)) {
    res.status(400).json({ error: "Numéro de téléphone invalide" });
    return;
  }

  if (isSimulationMode()) {
    req.log.warn({ orderId, mode: "simulation" }, "DiamanoPay simulation mode active");
    const simRef = `SIM-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    await db.update(ordersTable).set({
      paymentStatus: "paid",
      paymentReference: simRef,
      paymentMethod,
      status: "processing",
    }).where(eq(ordersTable.id, orderId));

    res.json({
      simulation: true,
      transactionId: simRef,
      paymentUrl: null,
      reference: order.reference,
      message: "Mode simulation — paiement validé automatiquement",
    });
    return;
  }

  try {
    const rawProto = req.headers["x-forwarded-proto"] as string | undefined;
    const rawHost = req.headers["x-forwarded-host"] as string | undefined;
    const proto = rawProto?.split(",")[0]?.trim() ?? req.protocol ?? "https";
    const host =
      rawHost?.split(",")[0]?.trim() ??
      (req.headers["host"] as string | undefined) ??
      "";
    const appBaseUrl = `${proto}://${host}`;

    req.log.info(
      {
        orderId,
        proto,
        host,
        appBaseUrl,
        envAppUrl: process.env.APP_URL ?? "(not set)",
        diamanoPaySuccessUrl: process.env.DIAMANOPAY_SUCCESS_URL ?? "(not set)",
        diamanoPayWebhookUrl: process.env.DIAMANOPAY_WEBHOOK_URL ?? "(not set)",
      },
      "DiamanoPay URL context before charge creation",
    );

    const charge = await createPayment({
      amount: order.servicePrice,
      method: paymentMethod,
      customerName: order.clientName,
      customerPhone: order.clientPhone,
      reference: order.reference,
      description: order.serviceName,
      appBaseUrl,
    });

    req.log.info(
      {
        orderId,
        method: paymentMethod,
        redirectUrl: charge._debug?.redirectUrl,
        webhookUrl: charge._debug?.webhookUrl,
        appBase: charge._debug?.appBase,
        chargeId: charge.chargeId ?? charge.id ?? charge.transactionId,
        hasPaymentUrl: !!(charge.paymentUrl ?? charge.payment_url ?? charge.link ?? charge.url),
      },
      "DiamanoPay charge created — redirect URLs used",
    );

    const chargeId =
      charge.chargeId ?? charge.id ?? charge.transactionId ?? String(Date.now());
    const paymentUrl =
      charge.paymentUrl ?? charge.payment_url ?? charge.link ??
      charge.url ?? charge.checkoutUrl ?? charge.checkout_url ?? null;
    const qrCode =
      charge.qrCodeData ?? charge.qrCode ?? charge.qr_code ?? charge.qrCodeUrl ?? null;

    await db.update(ordersTable).set({
      transactionId: chargeId,
      paymentMethod,
      paymentReference: chargeId,
    }).where(eq(ordersTable.id, orderId));

    req.log.info(
      { orderId, chargeId, paymentUrl, hasQrCode: !!qrCode, method: paymentMethod },
      "DiamanoPay charge created",
    );

    res.json({
      transactionId: chargeId,
      paymentUrl,
      qrCode,
      reference: order.reference,
    });
  } catch (err: unknown) {
    req.log.error({ err, orderId }, "DiamanoPay payment creation failed");

    if (simulationRequested()) {
      req.log.warn({ orderId }, "DiamanoPay failed — falling back to simulation mode");
      const simRef = `SIM-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
      await db.update(ordersTable).set({
        paymentStatus: "paid",
        paymentReference: simRef,
        paymentMethod,
        status: "processing",
      }).where(eq(ordersTable.id, orderId));

      res.json({
        simulation: true,
        transactionId: simRef,
        paymentUrl: null,
        reference: order.reference,
        message: "Mode simulation — paiement validé automatiquement",
      });
      return;
    }

    const apiErr = err as { status?: number; data?: { message?: string; error?: string } };
    const errMsg =
      apiErr.data?.message ??
      apiErr.data?.error ??
      (err instanceof Error ? err.message : null) ??
      "Erreur lors de la création du paiement";
    res.status(apiErr.status ?? 502).json({ error: errMsg });
  }
});

function normalizePaymentStatus(raw: string): string {
  const upper = (raw ?? "").toUpperCase().trim();
  if (["SUCCEEDED", "SUCCESS", "COMPLETED", "PAID"].includes(upper)) return "success";
  if (["FAILED", "FAILURE", "INSUFFICIENT_FUNDS", "REJECTED", "REFUSED", "DECLINED", "ERROR", "INSUFFISANT"].includes(upper)) return "failed";
  if (["CANCELLED", "CANCELED"].includes(upper)) return "cancelled";
  if (upper === "EXPIRED") return "expired";
  if (["PENDING", "INITIATED", "CREATED"].includes(upper)) return "pending";
  if (["PROCESSING", "IN_PROGRESS", "ONGOING"].includes(upper)) return "processing";
  return raw.toLowerCase();
}

router.get("/payment/status/:transactionId", async (req: Request, res: Response): Promise<void> => {
  const transactionId = req.params["transactionId"] as string;

  if (!transactionId) {
    res.status(400).json({ error: "transactionId requis" });
    return;
  }

  if (isSimulationMode()) {
    const [order] = await db.select().from(ordersTable)
      .where(eq(ordersTable.transactionId, transactionId));
    if (!order) {
      res.status(404).json({ error: "Transaction introuvable" });
      return;
    }
    const normalized = normalizePaymentStatus(order.paymentStatus ?? "pending");
    res.json({ transactionId, status: normalized, reference: order.reference });
    return;
  }

  try {
    const txn = await getPaymentStatus(transactionId);
    const normalized = normalizePaymentStatus(txn.status ?? "pending");
    req.log.info({ transactionId, rawStatus: txn.status, normalized }, "DiamanoPay status polled");
    res.json({ ...txn, status: normalized });
  } catch (err: unknown) {
    req.log.error({ err, transactionId }, "DiamanoPay status fetch failed");
    const apiErr = err as { status?: number; data?: { message?: string } };
    res.status(apiErr.status ?? 502).json({
      error: apiErr.data?.message ?? "Erreur lors de la récupération du statut",
    });
  }
});

router.get("/payment/verify/:reference", async (req: Request, res: Response): Promise<void> => {
  const { reference } = req.params as { reference: string };

  res.setHeader("Cache-Control", "no-store");

  const [order] = await db.select().from(ordersTable)
    .where(eq(ordersTable.reference, reference));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  if (order.paymentStatus === "paid") {
    res.json({ paymentStatus: "paid", updated: false });
    return;
  }

  if (!order.transactionId || isSimulationMode()) {
    res.json({ paymentStatus: order.paymentStatus ?? "pending", updated: false });
    return;
  }

  try {
    const txn = await getPaymentStatus(order.transactionId);
    const normalized = normalizePaymentStatus(txn.status ?? "pending");

    req.log.info(
      { reference, transactionId: order.transactionId, rawStatus: txn.status, normalized },
      "DiamanoPay verify called from tracking page",
    );

    const SUCCESS_STATUSES = ["success"];
    const FAILURE_STATUSES = ["failed", "cancelled", "expired"];

    let updated = false;
    if (SUCCESS_STATUSES.includes(normalized)) {
      await db.update(ordersTable).set({
        paymentStatus: "paid",
        status: "processing",
      }).where(eq(ordersTable.id, order.id));
      updated = true;
      req.log.info({ reference }, "Order marked paid via verify endpoint");
    } else if (FAILURE_STATUSES.includes(normalized) && order.paymentStatus !== "failed") {
      await db.update(ordersTable).set({
        paymentStatus: "failed",
      }).where(eq(ordersTable.id, order.id));
      updated = true;
      req.log.info({ reference }, "Order marked failed via verify endpoint");
    }

    res.json({ paymentStatus: normalized, updated });
  } catch (err: unknown) {
    const apiErr = err as { status?: number };
    req.log.warn({ err, reference, transactionId: order.transactionId }, "DiamanoPay verify failed — returning DB status");

    const [freshOrder] = await db.select().from(ordersTable)
      .where(eq(ordersTable.reference, reference));
    const currentStatus = freshOrder?.paymentStatus ?? order.paymentStatus ?? "pending";

    if (apiErr.status === 404) {
      res.json({ paymentStatus: currentStatus, updated: false });
    } else {
      res.json({ paymentStatus: currentStatus, updated: false });
    }
  }
});

router.post("/payment/callback", async (req: Request, res: Response): Promise<void> => {
  const payload = req.body as DiamanoPayCallbackPayload;
  req.log.info({ payload }, "DiamanoPay callback received");

  const id = payload.transactionId ?? payload.transaction_id ?? payload.chargeId;
  if (!id) {
    res.status(400).json({ error: "identifiant de transaction manquant" });
    return;
  }

  await handleTransactionUpdate(id, payload.status, req.log);
  res.json({ received: true });
});

router.post("/payment/webhook", async (req: Request, res: Response): Promise<void> => {
  const rawBody = JSON.stringify(req.body);
  const signature = req.headers["x-diamanopay-signature"] as string | undefined;
  const webhookSecret = process.env.DIAMANOPAY_WEBHOOK_SECRET;

  if (webhookSecret && signature) {
    const valid = verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!valid) {
      req.log.warn({ signature }, "Invalid DiamanoPay webhook signature");
      res.status(401).json({ error: "Signature invalide" });
      return;
    }
  }

  const payload = req.body as DiamanoPayWebhookPayload;
  const id =
    payload.transactionId ??
    payload.transaction_id ??
    payload.paymentRequestId ??
    payload.id ??
    payload.chargeId;
  const clientReference =
    payload.clientReference ??
    payload.client_reference ??
    payload.reference;
  req.log.info({ id, clientReference, status: payload.status, rawBody: req.body }, "DiamanoPay webhook received");

  if (!id && !clientReference) {
    res.status(400).json({ error: "identifiant de transaction manquant" });
    return;
  }

  await handleTransactionUpdate(id ?? "", payload.status, req.log, clientReference);
  res.json({ received: true });
});

async function handleTransactionUpdate(
  transactionId: string,
  status: string,
  log: Request["log"],
  clientReference?: string,
): Promise<void> {
  let order: typeof ordersTable.$inferSelect | undefined;

  if (transactionId) {
    const rows = await db.select().from(ordersTable)
      .where(eq(ordersTable.transactionId, transactionId));
    order = rows[0];
  }

  if (!order && clientReference) {
    log.info({ transactionId, clientReference }, "transactionId lookup failed, trying clientReference");
    const rows = await db.select().from(ordersTable)
      .where(eq(ordersTable.reference, clientReference));
    order = rows[0];
    if (order && transactionId) {
      await db.update(ordersTable)
        .set({ transactionId })
        .where(eq(ordersTable.id, order.id));
      log.info({ orderId: order.id, transactionId }, "Updated order transactionId from webhook");
    }
  }

  if (!order) {
    log.warn({ transactionId, clientReference }, "Order not found for transaction");
    return;
  }

  const updates: Partial<typeof ordersTable.$inferInsert> = {};
  const normalizedStatus = (status ?? "").toUpperCase().trim();

  const SUCCESS_STATUSES = ["SUCCEEDED", "SUCCESS", "COMPLETED", "PAID"];
  const FAILURE_STATUSES = [
    "FAILED", "FAILURE", "CANCELLED", "CANCELED", "EXPIRED",
    "INSUFFICIENT_FUNDS", "INSUFFISANT", "REJECTED", "REFUSED",
    "DECLINED", "ERROR",
  ];

  if (SUCCESS_STATUSES.includes(normalizedStatus)) {
    updates.paymentStatus = "paid";
    updates.status = "processing";
  } else if (FAILURE_STATUSES.includes(normalizedStatus)) {
    updates.paymentStatus = "failed";
  }

  if (Object.keys(updates).length > 0) {
    await db.update(ordersTable).set(updates).where(eq(ordersTable.id, order.id));
    log.info({ orderId: order.id, transactionId, status }, "Order payment status updated");
  }
}

export default router;
