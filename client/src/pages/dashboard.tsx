import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { HabitCard } from "@/components/habit-card";
import { AddHabitModal } from "@/components/add-habit-modal";
import { FloatingActionButton } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";
import { HabitWithStats } from "@shared/schema";
import { formatDate, getTodayDateString, generateWeekData } from "@/lib/habit-utils";
import { 
  Sun, 
  Moon, 
  User, 
  Plus,
  Trophy,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const { data: habits, isLoading: habitsLoading } = useQuery<HabitWithStats[]>({
    queryKey: ["/api/habits"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery<{
    totalHabits: number;
    completedToday: number;
    todayProgress: number;
    currentStreak: number;
  }>({
    queryKey: ["/api/stats"],
  });

  const { data: entries } = useQuery({
    queryKey: ["/api/entries"],
    queryFn: async () => {
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startDate = weekAgo.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const response = await fetch(`/api/entries?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
  });

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const weekData = entries ? generateWeekData(entries) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-primary via-purple-600 to-cyan-500 text-white p-4 shadow-lg relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-line text-xl"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold">HabitFlow</h1>
              <p className="text-sm opacity-90">
                {formatDate(getTodayDateString())}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-30 text-white"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-10 h-10 bg-white bg-opacity-20 rounded-xl hover:bg-white hover:bg-opacity-30 text-white"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      </header>

      {/* Stats Overview */}
      <div className="p-4 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path 
                  className="text-gray-200 dark:text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path 
                  className="text-green-500 transition-all duration-500" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeDasharray={`${stats?.todayProgress || 0}, 100`} 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                {statsLoading ? (
                  <Skeleton className="h-4 w-8" />
                ) : (
                  <span className="text-sm font-bold">{stats?.todayProgress || 0}%</span>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Today</p>
          </div>
          
          <div className="text-center">
            {statsLoading ? (
              <Skeleton className="h-8 w-12 mx-auto" />
            ) : (
              <div className="text-2xl font-bold text-yellow-500">{stats?.currentStreak || 0}</div>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
          </div>
          
          <div className="text-center">
            {statsLoading ? (
              <Skeleton className="h-8 w-8 mx-auto" />
            ) : (
              <div className="text-2xl font-bold text-primary">{stats?.totalHabits || 0}</div>
            )}
            <p className="text-xs text-gray-600 dark:text-gray-400">Habits</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10">
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="h-16 flex-col space-y-1 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          >
            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">Add Habit</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-16 flex-col space-y-1 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 border-green-200 dark:border-green-800"
          >
            <Trophy className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Goals</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-16 flex-col space-y-1 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-purple-200 dark:border-purple-800"
          >
            <i className="fas fa-chart-bar text-purple-600 dark:text-purple-400"></i>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Analytics</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="h-16 flex-col space-y-1 bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-orange-200 dark:border-orange-800"
          >
            <i className="fas fa-calendar text-orange-600 dark:text-orange-400"></i>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">Calendar</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            Today's Habits
            {stats && stats.todayProgress === 100 && (
              <Badge className="bg-green-500 text-white">
                <Trophy className="h-3 w-3 mr-1" />
                Complete!
              </Badge>
            )}
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Motivational Banner */}
        {stats && stats.currentStreak > 0 && (
          <Card className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Amazing Streak!</h3>
                  <p className="text-sm opacity-90">
                    You're on fire! {stats.currentStreak} days of consistency. Keep it up!
                  </p>
                </div>
                <Badge className="bg-white bg-opacity-20 text-white border-white/30">
                  {stats.currentStreak} days
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Progress Insight */}
        {stats && stats.todayProgress > 0 && stats.todayProgress < 100 && (
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Almost There!</h3>
                  <p className="text-sm opacity-90">
                    {Math.round(100 - stats.todayProgress)}% left to complete today's goals
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{stats.completedToday}</div>
                  <div className="text-xs opacity-75">of {stats.totalHabits}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habits List */}
        {habitsLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : habits && habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard key={habit.id} habit={habit} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Trophy className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Ready to Start Your Journey?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Transform your life one habit at a time. Small consistent actions lead to big results!
              </p>
              
              {/* Popular Habit Suggestions */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Popular habits to get started:</h4>
                <div className="grid grid-cols-2 gap-2 text-left">
                  {[
                    { icon: "fas fa-tint", name: "Drink 8 Glasses of Water", color: "blue" },
                    { icon: "fas fa-book-open", name: "Read 10 Pages", color: "green" },
                    { icon: "fas fa-meditation", name: "Meditate 5 Minutes", color: "purple" },
                    { icon: "fas fa-dumbbell", name: "Exercise 30 Minutes", color: "red" }
                  ].map((suggestion, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        suggestion.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                        suggestion.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' :
                        suggestion.color === 'purple' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400' :
                        'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        <i className={`${suggestion.icon} text-sm`}></i>
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{suggestion.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Weekly Overview */}
        {weekData.length > 0 && (
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">This Week</h3>
              <div className="grid grid-cols-7 gap-2">
                {weekData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      day.completed 
                        ? "bg-green-500 text-white" 
                        : index === weekData.length - 1 
                        ? "bg-primary text-white animate-pulse" 
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}>
                      {day.completed ? (
                        <i className="fas fa-check text-xs"></i>
                      ) : index === weekData.length - 1 ? (
                        <i className="fas fa-star text-xs"></i>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insights Card */}
        {stats && stats.todayProgress > 0 && (
          <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Great Progress!</h3>
                  <p className="text-sm opacity-90">
                    You've completed {stats.completedToday} out of {stats.totalHabits} habits today
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FAB */}
      <FloatingActionButton onClick={() => setIsAddModalOpen(true)} />

      {/* Add Habit Modal */}
      <AddHabitModal 
        open={isAddModalOpen} 
        onOpenChange={setIsAddModalOpen} 
      />
    </div>
  );
}
