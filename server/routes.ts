import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHabitSchema, insertHabitEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Mock user ID for demo purposes
  const DEMO_USER_ID = "demo-user";

  // Initialize demo user
  storage.createUser({ username: "demo", password: "demo" }).then(user => {
    // Create some demo habits
    const demoHabits = [
      {
        userId: user.id,
        name: "Morning Exercise",
        description: "30 minutes of exercise",
        icon: "fas fa-dumbbell",
        color: "blue",
        type: "boolean",
        target: 1,
        frequency: "daily"
      },
      {
        userId: user.id,
        name: "Read Daily",
        description: "Read 20 pages",
        icon: "fas fa-book-open",
        color: "green",
        type: "count",
        target: 20,
        frequency: "daily"
      },
      {
        userId: user.id,
        name: "Meditation",
        description: "10 minutes of mindfulness",
        icon: "fas fa-meditation",
        color: "purple",
        type: "time",
        target: 10,
        frequency: "daily"
      },
      {
        userId: user.id,
        name: "Drink Water",
        description: "8 glasses of water",
        icon: "fas fa-tint",
        color: "yellow",
        type: "count",
        target: 8,
        frequency: "daily"
      }
    ];

    demoHabits.forEach(async (habit) => {
      const createdHabit = await storage.createHabit(habit);
      
      // Create some demo entries for the past week
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Random completion for demo
        const completed = Math.random() > 0.3;
        const value = habit.type === "count" ? Math.floor(Math.random() * habit.target) + (completed ? habit.target : 0) : 0;
        
        await storage.createOrUpdateHabitEntry({
          habitId: createdHabit.id,
          date: dateStr,
          completed,
          value,
          notes: completed ? "Completed successfully!" : ""
        });
      }
    });
  });

  // Get all habits with stats
  app.get("/api/habits", async (req, res) => {
    try {
      const habits = await storage.getHabitsWithStats(DEMO_USER_ID);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch habits" });
    }
  });

  // Create new habit
  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit({ ...habitData, userId: DEMO_USER_ID });
      res.json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create habit" });
      }
    }
  });

  // Update habit
  app.patch("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const habit = await storage.updateHabit(id, updates);
      
      if (!habit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: "Failed to update habit" });
    }
  });

  // Delete habit
  app.delete("/api/habits/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteHabit(id);
      
      if (!success) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      res.json({ message: "Habit deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete habit" });
    }
  });

  // Complete/update habit entry
  app.post("/api/habits/:id/entries", async (req, res) => {
    try {
      const { id } = req.params;
      const entryData = insertHabitEntrySchema.parse({
        ...req.body,
        habitId: id
      });
      
      const entry = await storage.createOrUpdateHabitEntry(entryData);
      res.json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid entry data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update habit entry" });
      }
    }
  });

  // Get habit entries for date range
  app.get("/api/entries", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const entries = await storage.getUserEntriesForDateRange(
        DEMO_USER_ID, 
        startDate as string, 
        endDate as string
      );
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch entries" });
    }
  });

  // Get user stats
  app.get("/api/stats", async (req, res) => {
    try {
      const habits = await storage.getHabitsWithStats(DEMO_USER_ID);
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = await storage.getUserEntriesForDate(DEMO_USER_ID, today);
      
      const totalHabits = habits.length;
      const completedToday = todayEntries.filter(entry => entry.completed).length;
      const todayProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
      const currentStreak = Math.max(...habits.map(h => h.currentStreak), 0);
      
      res.json({
        totalHabits,
        completedToday,
        todayProgress,
        currentStreak
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Get achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(DEMO_USER_ID);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
