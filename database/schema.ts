import {  sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, varchar, date, timestamp, uuid } from "drizzle-orm/pg-core";

export const STATUS_ENUM = pgEnum("status", ['PENDING', 'APPROVED', 'REJECTED']);
export const ROLE_ENUM = pgEnum("role", ['USER', 'ADMIN']);
export const BORROW_STATUS = pgEnum("borrow_status", ['BORROWED', 'RETURN']);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom(), // Fixed default UUID issue
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  universityId: integer("university_id").notNull().unique(),
  password: text("password").notNull(),
  universityCard: text("university_card").notNull(),
  status: STATUS_ENUM("status").default('PENDING'),
  role: ROLE_ENUM("role").default('USER'),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow() // Used `timestamptz` instead of `timestamp`
});
