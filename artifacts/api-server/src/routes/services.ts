import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import multer from "multer";
import { db, servicesTable } from "@workspace/db";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.get("/services", async (_req, res): Promise<void> => {
  const services = await db
    .select()
    .from(servicesTable)
    .where(eq(servicesTable.active, true))
    .orderBy(servicesTable.createdAt);
  res.json(services);
});

router.get("/admin/services", requireAuth, async (_req, res): Promise<void> => {
  const services = await db
    .select()
    .from(servicesTable)
    .orderBy(servicesTable.createdAt);
  res.json(services);
});

router.post("/admin/services", requireAuth, async (req, res): Promise<void> => {
  const { id, name, description, price, delay, icon } = req.body as {
    id?: string; name?: string; description?: string;
    price?: number; delay?: string; icon?: string;
  };

  if (!id || !name || !description || price === undefined || !delay) {
    res.status(400).json({ error: "Champs requis: id, name, description, price, delay" });
    return;
  }

  const slug = id.trim().toLowerCase().replace(/\s+/g, "-");

  const existing = await db.select().from(servicesTable).where(eq(servicesTable.id, slug));
  if (existing.length > 0) {
    res.status(409).json({ error: `Un service avec l'identifiant "${slug}" existe déjà` });
    return;
  }

  const [service] = await db
    .insert(servicesTable)
    .values({ id: slug, name, description, price, delay, icon: icon ?? "FileText" })
    .returning();

  req.log.info({ serviceId: service.id }, "Service created");
  res.status(201).json(service);
});

router.put("/admin/services/:id", requireAuth, async (req, res): Promise<void> => {
  const { id } = req.params as { id: string };
  const { name, description, price, delay, icon, active } = req.body as {
    name?: string; description?: string; price?: number;
    delay?: string; icon?: string; active?: boolean;
  };

  const [service] = await db
    .update(servicesTable)
    .set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(delay !== undefined && { delay }),
      ...(icon !== undefined && { icon }),
      ...(active !== undefined && { active }),
      updatedAt: new Date(),
    })
    .where(eq(servicesTable.id, id))
    .returning();

  if (!service) {
    res.status(404).json({ error: "Service introuvable" });
    return;
  }

  req.log.info({ serviceId: id }, "Service updated");
  res.json(service);
});

router.post(
  "/admin/services/:id/image",
  requireAuth,
  imageUpload.single("image"),
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };

    if (!req.file) {
      res.status(400).json({ error: "Aucune image fournie" });
      return;
    }

    const base64 = req.file.buffer.toString("base64");
    const imageUrl = `data:${req.file.mimetype};base64,${base64}`;

    const [service] = await db
      .update(servicesTable)
      .set({ imageUrl, updatedAt: new Date() })
      .where(eq(servicesTable.id, id))
      .returning();

    if (!service) {
      res.status(404).json({ error: "Service introuvable" });
      return;
    }

    req.log.info({ serviceId: id }, "Service image uploaded");
    res.json(service);
  },
);

router.delete(
  "/admin/services/:id/image",
  requireAuth,
  async (req, res): Promise<void> => {
    const { id } = req.params as { id: string };

    const [service] = await db
      .update(servicesTable)
      .set({ imageUrl: null, updatedAt: new Date() })
      .where(eq(servicesTable.id, id))
      .returning();

    if (!service) {
      res.status(404).json({ error: "Service introuvable" });
      return;
    }

    req.log.info({ serviceId: id }, "Service image removed");
    res.json(service);
  },
);

router.delete("/admin/services/:id", requireAuth, async (req, res): Promise<void> => {
  const { id } = req.params as { id: string };

  const [service] = await db
    .delete(servicesTable)
    .where(eq(servicesTable.id, id))
    .returning();

  if (!service) {
    res.status(404).json({ error: "Service introuvable" });
    return;
  }

  req.log.info({ serviceId: id }, "Service deleted");
  res.json({ id });
});

export default router;
