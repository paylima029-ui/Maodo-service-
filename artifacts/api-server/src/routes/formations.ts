import { Router, type IRouter } from "express";
import { eq, asc, inArray } from "drizzle-orm";
import multer from "multer";
import { db, formationsTable, modulesTable, lessonsTable, quizzesTable, quizOptionsTable, ordersTable, formationCompletionsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    cb(null, allowed.includes(file.mimetype));
  },
});

function formatFormation(f: typeof formationsTable.$inferSelect) {
  return {
    ...f,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  };
}

function formatModule(m: typeof modulesTable.$inferSelect) {
  return {
    ...m,
    createdAt: m.createdAt.toISOString(),
  };
}

function formatLesson(l: typeof lessonsTable.$inferSelect) {
  return {
    ...l,
    createdAt: l.createdAt.toISOString(),
    updatedAt: l.updatedAt.toISOString(),
  };
}

router.get("/formations", async (_req, res): Promise<void> => {
  const formations = await db
    .select()
    .from(formationsTable)
    .where(eq(formationsTable.active, true))
    .orderBy(asc(formationsTable.id));
  res.json(formations.map(formatFormation));
});

router.get("/formations/:id", async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (isNaN(id)) { res.status(400).json({ error: "ID invalide" }); return; }

  const [formation] = await db
    .select()
    .from(formationsTable)
    .where(eq(formationsTable.id, id));

  if (!formation) { res.status(404).json({ error: "Formation introuvable" }); return; }

  const modules = await db
    .select()
    .from(modulesTable)
    .where(eq(modulesTable.formationId, id))
    .orderBy(asc(modulesTable.order));

  const lessons = modules.length > 0
    ? await db
        .select()
        .from(lessonsTable)
        .where(inArray(lessonsTable.moduleId, modules.map((m) => m.id)))
        .orderBy(asc(lessonsTable.order))
    : [];

  const modulesWithLessons = modules.map((m) => ({
    ...formatModule(m),
    lessons: lessons.filter((l) => l.moduleId === m.id).map(formatLesson),
  }));

  res.json({ ...formatFormation(formation), modules: modulesWithLessons });
});

router.get("/admin/formations", requireAuth, async (_req, res): Promise<void> => {
  const formations = await db.select().from(formationsTable).orderBy(asc(formationsTable.id));
  if (formations.length === 0) { res.json([]); return; }

  const allModules = await db
    .select()
    .from(modulesTable)
    .where(inArray(modulesTable.formationId, formations.map((f) => f.id)))
    .orderBy(asc(modulesTable.order));

  const allLessons = allModules.length > 0
    ? await db
        .select()
        .from(lessonsTable)
        .where(inArray(lessonsTable.moduleId, allModules.map((m) => m.id)))
        .orderBy(asc(lessonsTable.order))
    : [];

  const result = formations.map((f) => {
    const modules = allModules
      .filter((m) => m.formationId === f.id)
      .map((m) => ({
        ...formatModule(m),
        lessons: allLessons.filter((l) => l.moduleId === m.id).map(formatLesson),
      }));
    return { ...formatFormation(f), modules };
  });

  res.json(result);
});

router.post("/admin/formations/:id/image", requireAuth, imageUpload.single("image"), async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (!req.file) { res.status(400).json({ error: "Aucun fichier reçu" }); return; }
  const base64 = req.file.buffer.toString("base64");
  const imageUrl = `data:${req.file.mimetype};base64,${base64}`;
  const [formation] = await db.update(formationsTable).set({ imageUrl, updatedAt: new Date() }).where(eq(formationsTable.id, id)).returning();
  if (!formation) { res.status(404).json({ error: "Formation introuvable" }); return; }
  res.json(formatFormation(formation));
});

router.delete("/admin/formations/:id/image", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [formation] = await db.update(formationsTable).set({ imageUrl: null, updatedAt: new Date() }).where(eq(formationsTable.id, id)).returning();
  if (!formation) { res.status(404).json({ error: "Formation introuvable" }); return; }
  res.json(formatFormation(formation));
});

router.post("/admin/lessons/:id/media", requireAuth, imageUpload.single("media"), async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  if (!req.file) { res.status(400).json({ error: "Aucun fichier reçu" }); return; }
  const base64 = req.file.buffer.toString("base64");
  const mediaUrl = `data:${req.file.mimetype};base64,${base64}`;
  const [lesson] = await db.update(lessonsTable).set({ mediaUrl, mediaType: "image", updatedAt: new Date() }).where(eq(lessonsTable.id, id)).returning();
  if (!lesson) { res.status(404).json({ error: "Leçon introuvable" }); return; }
  res.json(formatLesson(lesson));
});

router.post("/formation-completions", async (req, res): Promise<void> => {
  const { formationId, clientName, formationTitle } = req.body as {
    formationId?: number; clientName?: string; formationTitle?: string;
  };
  if (!formationId || !clientName) {
    res.status(400).json({ error: "Champs requis: formationId, clientName" });
    return;
  }
  const [completion] = await db
    .insert(formationCompletionsTable)
    .values({ formationId, clientName: clientName.trim(), formationTitle: formationTitle ?? "" })
    .returning();
  res.status(201).json({ id: completion.id });
});

router.get("/admin/formation-stats", requireAuth, async (_req, res): Promise<void> => {
  const formations = await db.select().from(formationsTable).orderBy(asc(formationsTable.id));
  const completions = await db.select().from(formationCompletionsTable).orderBy(desc(formationCompletionsTable.completedAt));

  const stats = formations.map((f) => {
    const fCompletions = completions.filter((c) => c.formationId === f.id);
    return {
      formationId: f.id,
      formationTitle: f.title,
      totalCompletions: fCompletions.length,
      learners: fCompletions.map((c) => ({
        name: c.clientName,
        completedAt: c.completedAt.toISOString(),
      })),
    };
  });

  res.json(stats);
});

// Récupérer les accès aux formations achetées — vérifie téléphone + nom
router.post("/formation-access/recover", async (req, res): Promise<void> => {
  const { phone, name } = req.body as { phone?: string; name?: string };
  if (!phone?.trim() || !name?.trim()) {
    res.status(400).json({ error: "Numéro de téléphone et nom requis" });
    return;
  }

  const normalizedPhone = phone.trim().replace(/\s+/g, "");
  const normalizedName = name.trim().toLowerCase();

  // Cherche toutes les commandes pour ce numéro
  const orders = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.clientPhone, normalizedPhone));

  // Filtre : formations payées ET dont le nom correspond (insensible à la casse)
  const formationOrders = orders.filter(
    (o) =>
      o.serviceId?.startsWith("formation-") &&
      (o.paymentStatus === "paid" || o.status === "completed") &&
      o.clientName?.trim().toLowerCase() === normalizedName
  );

  if (formationOrders.length === 0) {
    // Message volontairement vague pour ne pas aider un attaquant
    res.status(404).json({ error: "Aucun achat trouvé. Vérifiez votre numéro et le nom exact utilisé lors de l'achat." });
    return;
  }

  const formationIds = formationOrders
    .map((o) => parseInt(o.serviceId!.replace("formation-", ""), 10))
    .filter((id) => !isNaN(id));

  const formations = formationIds.length > 0
    ? await db
        .select({ id: formationsTable.id, title: formationsTable.title, slug: formationsTable.slug })
        .from(formationsTable)
        .where(inArray(formationsTable.id, formationIds))
    : [];

  res.json({ formations });
});

router.post("/formation-orders", async (req, res): Promise<void> => {
  const { formationId, clientName, clientPhone, clientEmail } = req.body as {
    formationId?: number; clientName?: string; clientPhone?: string; clientEmail?: string;
  };

  if (!formationId || !clientName || !clientPhone) {
    res.status(400).json({ error: "Champs requis: formationId, clientName, clientPhone" });
    return;
  }

  const [formation] = await db
    .select()
    .from(formationsTable)
    .where(eq(formationsTable.id, formationId));

  if (!formation) { res.status(404).json({ error: "Formation introuvable" }); return; }
  if (!formation.isPaid || !formation.price) {
    res.status(400).json({ error: "Cette formation est gratuite" });
    return;
  }

  const rand = Math.floor(Math.random() * 9999).toString().padStart(4, "0");
  const reference = `FM-${formationId}-${Date.now()}-${rand}`;

  const [order] = await db
    .insert(ordersTable)
    .values({
      reference,
      serviceId: `formation-${formationId}`,
      serviceName: formation.title,
      servicePrice: formation.price,
      serviceDelay: null,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail?.trim() ?? null,
      description: `Accès à la formation: ${formation.title}`,
      status: "pending",
      paymentStatus: "pending",
    })
    .returning();

  res.status(201).json({ orderId: order.id, reference: order.reference });
});

router.post("/admin/formations", requireAuth, async (req, res): Promise<void> => {
  const { slug, title, description, category, imageUrl, active, isPaid, price } = req.body as {
    slug?: string; title?: string; description?: string;
    category?: string; imageUrl?: string | null; active?: boolean;
    isPaid?: boolean; price?: number | null;
  };

  if (!slug || !title || !description || !category) {
    res.status(400).json({ error: "Champs requis: slug, title, description, category" });
    return;
  }

  const [formation] = await db
    .insert(formationsTable)
    .values({ slug, title, description, category, imageUrl: imageUrl ?? null, active: active ?? true, isPaid: isPaid ?? false, price: isPaid ? (price ?? null) : null })
    .returning();

  res.status(201).json(formatFormation(formation));
});

router.put("/admin/formations/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { slug, title, description, category, imageUrl, active, isPaid, price } = req.body as {
    slug?: string; title?: string; description?: string;
    category?: string; imageUrl?: string | null; active?: boolean;
    isPaid?: boolean; price?: number | null;
  };

  if (!slug || !title || !description || !category) {
    res.status(400).json({ error: "Champs requis: slug, title, description, category" });
    return;
  }

  const [formation] = await db
    .update(formationsTable)
    .set({ slug, title, description, category, imageUrl: imageUrl ?? null, active: active ?? true, isPaid: isPaid ?? false, price: isPaid ? (price ?? null) : null, updatedAt: new Date() })
    .where(eq(formationsTable.id, id))
    .returning();

  if (!formation) { res.status(404).json({ error: "Formation introuvable" }); return; }
  res.json(formatFormation(formation));
});

router.delete("/admin/formations/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [f] = await db.delete(formationsTable).where(eq(formationsTable.id, id)).returning();
  if (!f) { res.status(404).json({ error: "Formation introuvable" }); return; }
  res.json({ id: f.id });
});

router.post("/admin/modules", requireAuth, async (req, res): Promise<void> => {
  const { formationId, title, order } = req.body as {
    formationId?: number; title?: string; order?: number;
  };

  if (!formationId || !title) {
    res.status(400).json({ error: "Champs requis: formationId, title" });
    return;
  }

  const [module] = await db
    .insert(modulesTable)
    .values({ formationId, title, order: order ?? 0 })
    .returning();

  res.status(201).json(formatModule(module));
});

router.put("/admin/modules/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { formationId, title, order } = req.body as {
    formationId?: number; title?: string; order?: number;
  };

  if (!formationId || !title) {
    res.status(400).json({ error: "Champs requis: formationId, title" });
    return;
  }

  const [module] = await db
    .update(modulesTable)
    .set({ formationId, title, order: order ?? 0 })
    .where(eq(modulesTable.id, id))
    .returning();

  if (!module) { res.status(404).json({ error: "Module introuvable" }); return; }
  res.json(formatModule(module));
});

router.delete("/admin/modules/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [m] = await db.delete(modulesTable).where(eq(modulesTable.id, id)).returning();
  if (!m) { res.status(404).json({ error: "Module introuvable" }); return; }
  res.json({ id: m.id });
});

router.post("/admin/lessons", requireAuth, async (req, res): Promise<void> => {
  const { moduleId, title, theory, mediaType, mediaUrl, order } = req.body as {
    moduleId?: number; title?: string; theory?: string;
    mediaType?: string; mediaUrl?: string | null; order?: number;
  };

  if (!moduleId || !title) {
    res.status(400).json({ error: "Champs requis: moduleId, title" });
    return;
  }

  const [lesson] = await db
    .insert(lessonsTable)
    .values({
      moduleId,
      title,
      theory: theory ?? "",
      mediaType: (mediaType as "none" | "youtube" | "image") ?? "none",
      mediaUrl: mediaUrl ?? null,
      order: order ?? 0,
    })
    .returning();

  res.status(201).json(formatLesson(lesson));
});

router.put("/admin/lessons/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { moduleId, title, theory, mediaType, mediaUrl, order } = req.body as {
    moduleId?: number; title?: string; theory?: string;
    mediaType?: string; mediaUrl?: string | null; order?: number;
  };

  if (!moduleId || !title) {
    res.status(400).json({ error: "Champs requis: moduleId, title" });
    return;
  }

  const [lesson] = await db
    .update(lessonsTable)
    .set({
      moduleId,
      title,
      theory: theory ?? "",
      mediaType: (mediaType as "none" | "youtube" | "image") ?? "none",
      mediaUrl: mediaUrl ?? null,
      order: order ?? 0,
      updatedAt: new Date(),
    })
    .where(eq(lessonsTable.id, id))
    .returning();

  if (!lesson) { res.status(404).json({ error: "Leçon introuvable" }); return; }
  res.json(formatLesson(lesson));
});

router.delete("/admin/lessons/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [l] = await db.delete(lessonsTable).where(eq(lessonsTable.id, id)).returning();
  if (!l) { res.status(404).json({ error: "Leçon introuvable" }); return; }
  res.json({ id: l.id });
});

// ── Admin: Quiz routes ──────────────────────────────────────────────────────

router.get("/admin/lessons/:id/quizzes", requireAuth, async (req, res): Promise<void> => {
  const lessonId = parseInt(String(req.params.id), 10);
  const quizzes = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, lessonId)).orderBy(asc(quizzesTable.order));
  if (quizzes.length === 0) { res.json([]); return; }
  const options = await db.select().from(quizOptionsTable).where(inArray(quizOptionsTable.quizId, quizzes.map((q) => q.id))).orderBy(asc(quizOptionsTable.order));
  res.json(quizzes.map((q) => ({ ...q, createdAt: q.createdAt.toISOString(), options: options.filter((o) => o.quizId === q.id) })));
});

router.post("/admin/lessons/:id/quizzes", requireAuth, async (req, res): Promise<void> => {
  const lessonId = parseInt(String(req.params.id), 10);
  const { question, order } = req.body as { question?: string; order?: number };
  if (!question) { res.status(400).json({ error: "question requis" }); return; }
  const [quiz] = await db.insert(quizzesTable).values({ lessonId, question, order: order ?? 0 }).returning();
  res.status(201).json({ ...quiz, createdAt: quiz.createdAt.toISOString(), options: [] });
});

router.put("/admin/quizzes/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { question, order } = req.body as { question?: string; order?: number };
  if (!question) { res.status(400).json({ error: "question requis" }); return; }
  const [quiz] = await db.update(quizzesTable).set({ question, order: order ?? 0 }).where(eq(quizzesTable.id, id)).returning();
  if (!quiz) { res.status(404).json({ error: "Quiz introuvable" }); return; }
  res.json({ ...quiz, createdAt: quiz.createdAt.toISOString() });
});

router.delete("/admin/quizzes/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [q] = await db.delete(quizzesTable).where(eq(quizzesTable.id, id)).returning();
  if (!q) { res.status(404).json({ error: "Quiz introuvable" }); return; }
  res.json({ id: q.id });
});

router.post("/admin/quizzes/:id/options", requireAuth, async (req, res): Promise<void> => {
  const quizId = parseInt(String(req.params.id), 10);
  const { text, isCorrect, order } = req.body as { text?: string; isCorrect?: boolean; order?: number };
  if (!text) { res.status(400).json({ error: "text requis" }); return; }
  const [option] = await db.insert(quizOptionsTable).values({ quizId, text, isCorrect: isCorrect ?? false, order: order ?? 0 }).returning();
  res.status(201).json(option);
});

router.put("/admin/quiz-options/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const { text, isCorrect, order } = req.body as { text?: string; isCorrect?: boolean; order?: number };
  if (!text) { res.status(400).json({ error: "text requis" }); return; }
  const [option] = await db.update(quizOptionsTable).set({ text, isCorrect: isCorrect ?? false, order: order ?? 0 }).where(eq(quizOptionsTable.id, id)).returning();
  if (!option) { res.status(404).json({ error: "Option introuvable" }); return; }
  res.json(option);
});

router.delete("/admin/quiz-options/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(String(req.params.id), 10);
  const [o] = await db.delete(quizOptionsTable).where(eq(quizOptionsTable.id, id)).returning();
  if (!o) { res.status(404).json({ error: "Option introuvable" }); return; }
  res.json({ id: o.id });
});

// ── Public: Quiz routes ─────────────────────────────────────────────────────

router.get("/lessons/:id/quizzes", async (req, res): Promise<void> => {
  const lessonId = parseInt(String(req.params.id), 10);
  const quizzes = await db.select().from(quizzesTable).where(eq(quizzesTable.lessonId, lessonId)).orderBy(asc(quizzesTable.order));
  if (quizzes.length === 0) { res.json([]); return; }
  const allOptions = await db.select().from(quizOptionsTable).where(inArray(quizOptionsTable.quizId, quizzes.map((q) => q.id))).orderBy(asc(quizOptionsTable.order));
  res.json(quizzes.map((q) => ({
    id: q.id,
    question: q.question,
    order: q.order,
    options: allOptions.filter((o) => o.quizId === q.id).map((o) => ({ id: o.id, text: o.text, order: o.order })),
  })));
});

router.post("/lessons/:id/quiz/submit", async (req, res): Promise<void> => {
  const lessonId = parseInt(String(req.params.id), 10);
  const { answers } = req.body as { answers?: { quizId: number; optionId: number }[] };
  if (!answers || !Array.isArray(answers) || answers.length === 0) {
    res.status(400).json({ error: "answers requis" }); return;
  }
  const quizIds = answers.map((a) => a.quizId);
  const quizzes = await db.select().from(quizzesTable).where(inArray(quizzesTable.id, quizIds));
  const options = await db.select().from(quizOptionsTable).where(inArray(quizOptionsTable.quizId, quizIds));
  const lessonQuizIds = new Set(quizzes.filter((q) => q.lessonId === lessonId).map((q) => q.id));
  const results = answers.map((a) => {
    if (!lessonQuizIds.has(a.quizId)) return { quizId: a.quizId, correct: false, correctOptionId: null };
    const correctOpt = options.find((o) => o.quizId === a.quizId && o.isCorrect);
    return { quizId: a.quizId, correct: correctOpt ? a.optionId === correctOpt.id : false, correctOptionId: correctOpt?.id ?? null };
  });
  res.json({ score: results.filter((r) => r.correct).length, total: answers.length, results });
});

export default router;
