import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, ordersTable, servicesTable } from "@workspace/db";
import multer from "multer";
import path from "path";
import fs from "fs";

const router: IRouter = Router();

const workspaceRoot = process.cwd().endsWith(path.join("artifacts", "api-server"))
  ? path.resolve(process.cwd(), "../..")
  : process.cwd();

const uploadsDir = path.resolve(workspaceRoot, "artifacts/api-server/uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});

function generateReference(): string {
  const now = new Date();
  const year = now.getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `CMD-${year}-${random}`;
}

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

router.post("/orders", async (req, res): Promise<void> => {
  const { serviceId, clientName, clientPhone, clientEmail, description } = req.body as {
    serviceId?: string; clientName?: string; clientPhone?: string;
    clientEmail?: string; description?: string;
  };

  if (!serviceId || !clientName || !clientPhone || !description) {
    res.status(400).json({ error: "Champs requis: serviceId, clientName, clientPhone, description" });
    return;
  }

  const [service] = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.id, serviceId));
  if (!service) {
    res.status(400).json({ error: "Service introuvable" });
    return;
  }

  const reference = generateReference();

  const [order] = await db
    .insert(ordersTable)
    .values({
      reference,
      serviceId: service.id,
      serviceName: service.name,
      servicePrice: service.price,
      serviceDelay: service.delay,
      clientName,
      clientPhone,
      clientEmail: clientEmail ?? null,
      description,
      status: "pending",
      paymentStatus: "pending",
    })
    .returning();

  req.log.info({ orderId: order.id, reference }, "Order created");
  res.status(201).json(formatOrder(order));
});

router.get("/orders", async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };

  let query = db.select().from(ordersTable).$dynamic();
  if (status) {
    query = query.where(eq(ordersTable.status, status as "pending" | "processing" | "completed" | "cancelled"));
  }

  const orders = await query.orderBy(ordersTable.createdAt);
  res.json(orders.map(formatOrder));
});

router.get("/orders/ref/:reference", async (req, res): Promise<void> => {
  const { reference } = req.params as { reference: string };

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.reference, reference));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  res.json(formatOrder(order));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  res.json(formatOrder(order));
});

router.delete("/admin/orders", async (req, res): Promise<void> => {
  const { status } = req.query as { status?: string };

  let deleted: typeof ordersTable.$inferSelect[];
  if (status) {
    deleted = await db
      .delete(ordersTable)
      .where(eq(ordersTable.status, status as "pending" | "processing" | "completed" | "cancelled"))
      .returning();
  } else {
    deleted = await db.delete(ordersTable).returning();
  }

  req.log.info({ count: deleted.length, status }, "Order history cleared");
  res.json({ deleted: deleted.length });
});

router.delete("/admin/orders/:id", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "ID invalide" });
    return;
  }

  const [order] = await db
    .delete(ordersTable)
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  req.log.info({ orderId: id }, "Order deleted");
  res.json({ id: order.id });
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);
  const { status } = req.body as { status?: string };

  if (isNaN(id) || !status) {
    res.status(400).json({ error: "ID et status requis" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: status as "pending" | "processing" | "completed" | "cancelled" })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  req.log.info({ orderId: order.id, status }, "Order status updated");
  res.json(formatOrder(order));
});

router.post("/orders/:id/file", upload.single("file"), async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  if (!req.file) {
    res.status(400).json({ error: "Aucun fichier fourni" });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({
      fileName: req.file.originalname,
      filePath: req.file.filename,
    })
    .where(eq(ordersTable.id, id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  req.log.info({ orderId: id, fileName: req.file.originalname }, "File uploaded");
  res.json({ success: true, fileName: req.file.originalname });
});

router.get("/orders/:id/file", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(rawId, 10);

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, id));

  if (!order || !order.filePath) {
    res.status(404).json({ error: "Fichier introuvable" });
    return;
  }

  const filePath = path.resolve(uploadsDir, order.filePath);

  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "Fichier introuvable sur le serveur" });
    return;
  }

  const ext = path.extname(order.fileName ?? order.filePath).toLowerCase();
  const inlineTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };

  const mimeType = inlineTypes[ext];
  if (mimeType) {
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${order.fileName ?? order.filePath}"`);
    res.sendFile(filePath);
  } else {
    res.download(filePath, order.fileName ?? order.filePath);
  }
});

export default router;
