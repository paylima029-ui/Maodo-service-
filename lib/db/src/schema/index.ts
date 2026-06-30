import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";

export const adminUsersTable = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  salt: text("salt").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const servicesTable = pgTable("services", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  delay: text("delay").notNull(),
  icon: text("icon").notNull().default("FileText"),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  reference: text("reference").notNull().unique(),
  serviceId: text("service_id").notNull(),
  serviceName: text("service_name").notNull(),
  servicePrice: integer("service_price").notNull(),
  serviceDelay: text("service_delay"),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone").notNull(),
  clientEmail: text("client_email"),
  description: text("description").notNull(),
  fileName: text("file_name"),
  filePath: text("file_path"),
  status: text("status", { enum: ["pending", "processing", "completed", "cancelled"] }).notNull().default("pending"),
  paymentStatus: text("payment_status", { enum: ["pending", "paid", "failed"] }).notNull().default("pending"),
  paymentReference: text("payment_reference"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const visitsTable = pgTable("visits", {
  id: serial("id").primaryKey(),
  visitDate: date("visit_date").notNull(),
  count: integer("count").notNull().default(0),
});

export const formationsTable = pgTable("formations", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull().default("general"),
  imageUrl: text("image_url"),
  active: boolean("active").notNull().default(true),
  isPaid: boolean("is_paid").notNull().default(false),
  price: integer("price"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull(),
  title: text("title").notNull(),
  theory: text("theory").notNull().default(""),
  mediaType: text("media_type", { enum: ["none", "youtube", "image"] }).notNull().default("none"),
  mediaUrl: text("media_url"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Visit = typeof visitsTable.$inferSelect;
export type InsertVisit = typeof visitsTable.$inferInsert;

export type AdminUser = typeof adminUsersTable.$inferSelect;
export type InsertAdminUser = typeof adminUsersTable.$inferInsert;
export type Service = typeof servicesTable.$inferSelect;
export type InsertService = typeof servicesTable.$inferInsert;
export type Order = typeof ordersTable.$inferSelect;
export type InsertOrder = typeof ordersTable.$inferInsert;

export const quizzesTable = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull(),
  question: text("question").notNull(),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizOptionsTable = pgTable("quiz_options", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull(),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export type Formation = typeof formationsTable.$inferSelect;
export type InsertFormation = typeof formationsTable.$inferInsert;
export type Module = typeof modulesTable.$inferSelect;
export type InsertModule = typeof modulesTable.$inferInsert;
export type Lesson = typeof lessonsTable.$inferSelect;
export type InsertLesson = typeof lessonsTable.$inferInsert;
export type Quiz = typeof quizzesTable.$inferSelect;
export type InsertQuiz = typeof quizzesTable.$inferInsert;
export type QuizOption = typeof quizOptionsTable.$inferSelect;
export type InsertQuizOption = typeof quizOptionsTable.$inferInsert;
