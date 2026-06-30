import { db, adminUsersTable, servicesTable } from "@workspace/db";
import { hashPassword } from "./auth";
import type { Logger } from "pino";

const INITIAL_SERVICES = [
  { id: "cv", name: "CV Professionnel", price: 5000, delay: "24h", description: "Un CV moderne qui attire l'attention", icon: "FileText" },
  { id: "lettre", name: "Lettre de motivation", price: 3000, delay: "12h", description: "Percutante et personnalisée", icon: "Mail" },
  { id: "correction", name: "Correction de CV", price: 2500, delay: "6h", description: "Votre CV optimisé par un expert", icon: "CheckCircle" },
  { id: "dossier", name: "Dossier d'études à l'étranger", price: 15000, delay: "72h", description: "Dossier complet et conforme", icon: "GraduationCap" },
  { id: "site", name: "Site web simple", price: 50000, delay: "7 jours", description: "Votre présence en ligne", icon: "Globe" },
];

const ADMIN_EMAIL = "maodok595@gmail.com";
const ADMIN_PASSWORD = "782662435";

export async function seed(log: Logger): Promise<void> {
  const existingAdmins = await db.select().from(adminUsersTable).limit(1);
  if (existingAdmins.length === 0) {
    const { hash, salt } = hashPassword(ADMIN_PASSWORD);
    await db.insert(adminUsersTable).values({
      email: ADMIN_EMAIL,
      passwordHash: hash,
      salt,
    });
    log.info({ email: ADMIN_EMAIL }, "Admin account seeded");
  }

  const existingServices = await db.select().from(servicesTable).limit(1);
  if (existingServices.length === 0) {
    await db.insert(servicesTable).values(INITIAL_SERVICES);
    log.info({ count: INITIAL_SERVICES.length }, "Initial services seeded");
  }
}
