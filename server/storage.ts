import { type User, type InsertUser, type Habit, type InsertHabit, type HabitEntry, type InsertHabitEntry, type Achievement, type InsertAchievement, type HabitWithStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Habits
  getHabits(userId: string): Promise<Habit[]>;
  getHabitsWithStats(userId: string): Promise<HabitWithStats[]>;
  getHabit(id: string): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit & { userId: string }): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined>;
  deleteHabit(id: string): Promise<boolean>;

  // Habit Entries
  getHabitEntries(habitId: string): Promise<HabitEntry[]>;
  getHabitEntry(habitId: string, date: string): Promise<HabitEntry | undefined>;
  createOrUpdateHabitEntry(entry: InsertHabitEntry): Promise<HabitEntry>;
  getUserEntriesForDate(userId: string, date: string): Promise<HabitEntry[]>;
  getUserEntriesForDateRange(userId: string, startDate: string, endDate: string): Promise<HabitEntry[]>;

  // Achievements
  getUserAchievements(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement & { userId: string }): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private habits: Map<string, Habit>;
  private habitEntries: Map<string, HabitEntry>;
  private achievements: Map<string, Achievement>;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.habitEntries = new Map();
    this.achievements = new Map();
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  // Habits
  async getHabits(userId: string): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId && habit.isActive);
  }

  async getHabitsWithStats(userId: string): Promise<HabitWithStats[]> {
    const habits = await this.getHabits(userId);
    const today = new Date().toISOString().split('T')[0];
    
    return Promise.all(habits.map(async (habit) => {
      const entries = await this.getHabitEntries(habit.id);
      const todayEntry = entries.find(entry => entry.date === today);
      
      // Calculate streaks
      const sortedEntries = entries
        .filter(entry => entry.completed)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      const today_date = new Date();
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today_date);
        checkDate.setDate(today_date.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        const hasEntry = sortedEntries.some(entry => entry.date === dateStr);
        
        if (hasEntry) {
          if (i === currentStreak) {
            currentStreak++;
          }
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }
      
      const completionRate = entries.length > 0 
        ? (entries.filter(entry => entry.completed).length / entries.length) * 100 
        : 0;

      return {
        ...habit,
        currentStreak,
        longestStreak,
        completionRate: Math.round(completionRate),
        todayEntry,
        totalEntries: entries.length
      };
    }));
  }

  async getHabit(id: string): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(habitData: InsertHabit & { userId: string }): Promise<Habit> {
    const id = randomUUID();
    const habit: Habit = {
      id,
      userId: habitData.userId,
      name: habitData.name,
      description: habitData.description || null,
      icon: habitData.icon || "fas fa-star",
      color: habitData.color || "blue",
      type: habitData.type || "boolean",
      target: habitData.target || 1,
      frequency: habitData.frequency || "daily",
      frequencyData: habitData.frequencyData || null,
      isActive: habitData.isActive ?? true,
      createdAt: new Date()
    };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;
    
    const updatedHabit = { ...habit, ...updates };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: string): Promise<boolean> {
    const habit = this.habits.get(id);
    if (!habit) return false;
    
    // Soft delete
    await this.updateHabit(id, { isActive: false });
    return true;
  }

  // Habit Entries
  async getHabitEntries(habitId: string): Promise<HabitEntry[]> {
    return Array.from(this.habitEntries.values()).filter(entry => entry.habitId === habitId);
  }

  async getHabitEntry(habitId: string, date: string): Promise<HabitEntry | undefined> {
    return Array.from(this.habitEntries.values())
      .find(entry => entry.habitId === habitId && entry.date === date);
  }

  async createOrUpdateHabitEntry(entryData: InsertHabitEntry): Promise<HabitEntry> {
    const existingEntry = await this.getHabitEntry(entryData.habitId || "", entryData.date);
    
    if (existingEntry) {
      const updatedEntry = { ...existingEntry, ...entryData };
      this.habitEntries.set(existingEntry.id, updatedEntry);
      return updatedEntry;
    } else {
      const id = randomUUID();
      const entry: HabitEntry = {
        id,
        habitId: entryData.habitId || "",
        date: entryData.date,
        completed: entryData.completed ?? false,
        value: entryData.value ?? 0,
        notes: entryData.notes || null,
        createdAt: new Date()
      };
      this.habitEntries.set(id, entry);
      return entry;
    }
  }

  async getUserEntriesForDate(userId: string, date: string): Promise<HabitEntry[]> {
    const userHabits = await this.getHabits(userId);
    const habitIds = userHabits.map(habit => habit.id);
    
    return Array.from(this.habitEntries.values())
      .filter(entry => entry.habitId && habitIds.includes(entry.habitId) && entry.date === date);
  }

  async getUserEntriesForDateRange(userId: string, startDate: string, endDate: string): Promise<HabitEntry[]> {
    const userHabits = await this.getHabits(userId);
    const habitIds = userHabits.map(habit => habit.id);
    
    return Array.from(this.habitEntries.values())
      .filter(entry => 
        entry.habitId && habitIds.includes(entry.habitId) && 
        entry.date >= startDate && 
        entry.date <= endDate
      );
  }

  // Achievements
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.userId === userId);
  }

  async createAchievement(achievementData: InsertAchievement & { userId: string }): Promise<Achievement> {
    const id = randomUUID();
    const achievement: Achievement = {
      id,
      userId: achievementData.userId,
      type: achievementData.type,
      habitId: achievementData.habitId || null,
      title: achievementData.title,
      description: achievementData.description || null,
      icon: achievementData.icon,
      unlockedAt: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
