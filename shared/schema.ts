import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Glasačko mjesto schema
export const glasackaMjesta = pgTable("glasacka_mjesta", {
  id: varchar("id").primaryKey(),
  naziv: text("naziv").notNull(),
  opstina: text("opstina").notNull(),
  entitet: text("entitet").notNull(), // FBiH, RS, BD
  grad: text("grad").notNull(),
  koordinate: jsonb("koordinate").$type<[number, number]>().notNull(),
  status: text("status").notNull(), // aktivno, neaktivno, upozorenje, kriticno
  brojBiraca: integer("broj_biraca").notNull(),
  glasalo: integer("glasalo").notNull().default(0),
  izlaznost: decimal("izlaznost", { precision: 5, scale: 2 }).notNull().default("0"),
  validnihGlasova: integer("validnih_glasova").notNull().default(0),
  nevazeciGlasova: integer("nevazeci_glasova").notNull().default(0),
  spornihGlasova: integer("spornih_glasova").notNull().default(0),
  autentifikacije: jsonb("autentifikacije").$type<{
    uspjesne: number;
    neuspjesne: number;
    blokirane: number;
    prosjecnoVrijeme: string;
  }>().notNull(),
  zadnjeAzuriranje: timestamp("zadnje_azuriranje").notNull().defaultNow(),
});

// Anomalije schema
export const anomalije = pgTable("anomalije", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  glasackoMjestoId: varchar("glasacko_mjesto_id").notNull(),
  tip: text("tip").notNull(), // kritično, upozorenje
  opis: text("opis").notNull(),
  vrijeme: text("vrijeme").notNull(),
  status: text("status").notNull(), // aktivno, riješeno
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertGlasackoMjestoSchema = createInsertSchema(glasackaMjesta).omit({
  zadnjeAzuriranje: true,
});

export const insertAnomalijaSchema = createInsertSchema(anomalije).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertGlasackoMjesto = z.infer<typeof insertGlasackoMjestoSchema>;
export type GlasackoMjesto = typeof glasackaMjesta.$inferSelect;

export type InsertAnomalija = z.infer<typeof insertAnomalijaSchema>;
export type Anomalija = typeof anomalije.$inferSelect;

// User schema (keeping existing)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
