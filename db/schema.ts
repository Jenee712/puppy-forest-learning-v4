import { integer, primaryKey, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const families = sqliteTable("families", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  plan: text("plan", { enum: ["single", "personal_all", "family_all"] }).notNull().default("single"),
  paidAmount: real("paid_amount").notNull().default(0),
  aiCredits: integer("ai_credits").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const children = sqliteTable("children", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  nickname: text("nickname").notNull(),
  birthYear: integer("birth_year"),
  currentGrade: text("current_grade").notNull().default("G1"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const entitlements = sqliteTable("entitlements", {
  familyId: text("family_id").notNull().references(() => families.id, { onDelete: "cascade" }),
  grade: text("grade").notNull(),
  source: text("source", { enum: ["first_level", "upgrade", "personal_all", "family_all"] }).notNull(),
  orderId: text("order_id"),
  unlockedAt: integer("unlocked_at", { mode: "timestamp" }).notNull(),
}, (table) => [primaryKey({ columns: [table.familyId, table.grade] })]);

export const learningProgress = sqliteTable("learning_progress", {
  id: text("id").primaryKey(),
  childId: text("child_id").notNull().references(() => children.id, { onDelete: "cascade" }),
  grade: text("grade").notNull(),
  subject: text("subject").notNull(),
  knowledgePoint: text("knowledge_point").notNull(),
  mastery: integer("mastery").notNull().default(0),
  attempts: integer("attempts").notNull().default(0),
  correctAttempts: integer("correct_attempts").notNull().default(0),
  nextReviewAt: integer("next_review_at", { mode: "timestamp" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(),
  familyId: text("family_id").notNull().references(() => families.id),
  product: text("product").notNull(),
  amount: real("amount").notNull(),
  status: text("status", { enum: ["pending", "paid", "refunded", "closed"] }).notNull().default("pending"),
  providerReference: text("provider_reference"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  paidAt: integer("paid_at", { mode: "timestamp" }),
});
