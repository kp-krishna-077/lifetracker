import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habits = pgTable("habits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("fas fa-star"),
  color: text("color").notNull().default("blue"),
  type: text("type").notNull().default("boolean"), // boolean, count, time
  target: integer("target").default(1), // target count/minutes
  frequency: text("frequency").notNull().default("daily"), // daily, weekly, custom
  frequencyData: jsonb("frequency_data"), // custom frequency data
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const habitEntries = pgTable("habit_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  habitId: varchar("habit_id").references(() => habits.id),
  date: text("date").notNull(), // YYYY-MM-DD format
  completed: boolean("completed").default(false),
  value: integer("value").default(0), // for count-based habits
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  type: text("type").notNull(), // streak, consistency, milestone
  habitId: varchar("habit_id").references(() => habits.id),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHabitSchema = createInsertSchema(habits).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertHabitEntrySchema = createInsertSchema(habitEntries).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Habit = typeof habits.$inferSelect;
export type InsertHabit = z.infer<typeof insertHabitSchema>;

export type HabitEntry = typeof habitEntries.$inferSelect;
export type InsertHabitEntry = z.infer<typeof insertHabitEntrySchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

// Extended types for frontend
export type HabitWithStats = Habit & {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  todayEntry?: HabitEntry;
  totalEntries: number;
};
