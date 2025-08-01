import { HabitWithStats, HabitEntry } from "@shared/schema";

export function getHabitColor(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  };
  
  return colorMap[color] || colorMap.blue;
}

export function getHabitButtonColor(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    red: "bg-red-500 hover:bg-red-600",
    pink: "bg-pink-500 hover:bg-pink-600",
    indigo: "bg-indigo-500 hover:bg-indigo-600",
    orange: "bg-orange-500 hover:bg-orange-600",
  };
  
  return colorMap[color] || colorMap.blue;
}

export function formatStreak(streak: number): string {
  if (streak === 0) return "💔 No streak";
  if (streak === 1) return "🔥 1 day";
  return `🔥 ${streak} days`;
}

export function getProgressPercentage(habit: HabitWithStats): number {
  if (!habit.todayEntry) return 0;
  
  if (habit.type === "boolean") {
    return habit.todayEntry.completed ? 100 : 0;
  }
  
  if (habit.type === "count" || habit.type === "time") {
    return Math.min((habit.todayEntry.value / habit.target) * 100, 100);
  }
  
  return 0;
}

export function getProgressDisplay(habit: HabitWithStats): string {
  if (!habit.todayEntry) {
    return habit.type === "boolean" ? "Not completed" : `0/${habit.target}`;
  }
  
  if (habit.type === "boolean") {
    return habit.todayEntry.completed ? "Completed" : "Not completed";
  }
  
  if (habit.type === "count") {
    return `${habit.todayEntry.value}/${habit.target}`;
  }
  
  if (habit.type === "time") {
    return `${habit.todayEntry.value}/${habit.target} min`;
  }
  
  return "";
}

export function generateWeekData(entries: HabitEntry[]): Array<{ day: string; completed: boolean; date: string }> {
  const today = new Date();
  const weekData = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
    
    const dayEntries = entries.filter(entry => entry.date === dateStr);
    const completed = dayEntries.some(entry => entry.completed);
    
    weekData.push({
      day: dayName,
      completed,
      date: dateStr
    });
  }
  
  return weekData;
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}
