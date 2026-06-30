import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { db, visitsTable } from "@workspace/db";

const router: IRouter = Router();

function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

router.post("/visits", async (_req, res): Promise<void> => {
  const today = todayDateString();

  const existing = await db
    .select()
    .from(visitsTable)
    .where(eq(visitsTable.visitDate, today));

  if (existing.length > 0) {
    const [updated] = await db
      .update(visitsTable)
      .set({ count: existing[0].count + 1 })
      .where(eq(visitsTable.visitDate, today))
      .returning();
    res.json({ date: updated.visitDate, count: updated.count });
  } else {
    const [created] = await db
      .insert(visitsTable)
      .values({ visitDate: today, count: 1 })
      .returning();
    res.json({ date: created.visitDate, count: created.count });
  }
});

router.get("/visits/today", async (_req, res): Promise<void> => {
  const today = todayDateString();
  const [row] = await db
    .select()
    .from(visitsTable)
    .where(eq(visitsTable.visitDate, today));
  res.json({ date: today, count: row?.count ?? 0 });
});

router.get("/visits/stats", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(visitsTable)
    .orderBy(desc(visitsTable.visitDate))
    .limit(7);
  res.json(rows.map((r) => ({ date: r.visitDate, count: r.count })));
});

export default router;
