import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, adminUsersTable } from "@workspace/db";
import { verifyPassword, createToken } from "../lib/auth";

const router: IRouter = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };

  if (!email || !password) {
    res.status(400).json({ error: "Email et mot de passe requis" });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email.toLowerCase().trim()));

  if (!admin || !verifyPassword(password, admin.passwordHash, admin.salt)) {
    res.status(401).json({ error: "Email ou mot de passe incorrect" });
    return;
  }

  const token = createToken(admin.email);
  req.log.info({ email: admin.email }, "Admin logged in");
  res.json({ token, email: admin.email });
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const header = req.headers["authorization"];
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Non authentifié" });
    return;
  }
  const { verifyToken } = await import("../lib/auth");
  const payload = verifyToken(header.slice(7));
  if (!payload) {
    res.status(401).json({ error: "Token invalide" });
    return;
  }
  res.json({ email: payload.email });
});

export default router;
