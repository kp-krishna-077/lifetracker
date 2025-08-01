import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { HabitWithStats } from "@shared/schema";
import { BarChart3, TrendingUp, Target, Calendar } from "lucide-react";

export default function Analytics() {
  const { data: habits, isLoading } = useQuery<HabitWithStats[]>({
    queryKey: ["/api/habits"],
  });

  const { data: stats } = useQuery<{
    totalHabits: number;
    completedToday: number;
    todayProgress: number;
    currentStreak: number;
  }>({
    queryKey: ["/api/stats"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
        <div className="p-4 pt-6 space-y-4">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-4 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const bestHabit = habits && habits.length > 0 
    ? habits.reduce((best, current) => 
        current.completionRate > (best?.completionRate || 0) ? current : best
      )
    : null;

  const longestStreak = habits?.reduce((max, current) => 
    current.longestStreak > max ? current.longestStreak : max, 0
  ) || 0;

  const averageCompletion = habits && habits.length > 0 
    ? Math.round(habits.reduce((sum, habit) => sum + habit.completionRate, 0) / habits.length)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="p-4 pt-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{stats?.currentStreak || 0}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{longestStreak}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-1">{averageCompletion}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">{habits?.length || 0}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Habits</p>
            </CardContent>
          </Card>
        </div>

        {/* Best Performing Habit */}
        {bestHabit && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Best Performing Habit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  bestHabit.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                  bestHabit.color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                  bestHabit.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                  "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}>
                  <i className={`${bestHabit.icon} text-sm`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{bestHabit.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {bestHabit.completionRate}% completion rate
                  </p>
                </div>
                <div className="text-2xl">🏆</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Habit Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Habit Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habits && habits.length > 0 ? (
              habits.map((habit) => (
                <div key={habit.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                        habit.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                        habit.color === "green" ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                        habit.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                        habit.color === "yellow" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" :
                        "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        <i className={`${habit.icon} text-xs`}></i>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {habit.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {habit.completionRate}%
                    </span>
                  </div>
                  <Progress value={habit.completionRate} className="h-2" />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No habits to analyze yet. Add some habits to see your analytics!
              </p>
            )}
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {habits && habits.length > 0 ? (
              <>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-blue-500">💡</div>
                  <div>
                    <p className="text-sm text-gray-900 dark:text-white">
                      You're most consistent with habits that have clear, achievable targets.
                    </p>
                  </div>
                </div>
                
                {stats && stats.todayProgress > 75 && (
                  <div className="flex items-start space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-green-500">🎉</div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Great job today! You've completed {stats.todayProgress}% of your habits.
                      </p>
                    </div>
                  </div>
                )}
                
                {longestStreak >= 7 && (
                  <div className="flex items-start space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-yellow-500">🔥</div>
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">
                        Amazing! Your longest streak is {longestStreak} days. Keep the momentum going!
                      </p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Start tracking habits to get personalized insights!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
