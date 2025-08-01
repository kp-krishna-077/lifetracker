import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Trophy, Star, Target, Flame, Award, Calendar } from "lucide-react";
import { HabitWithStats } from "@shared/schema";

export default function Achievements() {
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

  // Generate achievements based on current data
  const generateAchievements = () => {
    if (!habits || !stats) return [];

    const achievements = [];

    // Streak-based achievements
    if (stats.currentStreak >= 1) {
      achievements.push({
        id: 'first-streak',
        title: 'Getting Started',
        description: 'Completed habits for 1 day in a row',
        icon: 'fas fa-play',
        color: 'green',
        unlocked: true,
        rarity: 'common'
      });
    }

    if (stats.currentStreak >= 3) {
      achievements.push({
        id: 'three-day-streak',
        title: 'Building Momentum',
        description: 'Completed habits for 3 days in a row',
        icon: 'fas fa-fire',
        color: 'orange',
        unlocked: true,
        rarity: 'common'
      });
    }

    if (stats.currentStreak >= 7) {
      achievements.push({
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Completed habits for 7 days in a row',
        icon: 'fas fa-calendar-week',
        color: 'blue',
        unlocked: true,
        rarity: 'uncommon'
      });
    }

    if (stats.currentStreak >= 30) {
      achievements.push({
        id: 'month-master',
        title: 'Month Master',
        description: 'Completed habits for 30 days in a row',
        icon: 'fas fa-crown',
        color: 'purple',
        unlocked: true,
        rarity: 'rare'
      });
    }

    // Habit count achievements
    if (habits.length >= 1) {
      achievements.push({
        id: 'habit-starter',
        title: 'Habit Starter',
        description: 'Created your first habit',
        icon: 'fas fa-seedling',
        color: 'green',
        unlocked: true,
        rarity: 'common'
      });
    }

    if (habits.length >= 5) {
      achievements.push({
        id: 'habit-collector',
        title: 'Habit Collector',
        description: 'Created 5 different habits',
        icon: 'fas fa-collection',
        color: 'blue',
        unlocked: true,
        rarity: 'uncommon'
      });
    }

    if (habits.length >= 10) {
      achievements.push({
        id: 'habit-master',
        title: 'Habit Master',
        description: 'Created 10 different habits',
        icon: 'fas fa-star',
        color: 'purple',
        unlocked: true,
        rarity: 'rare'
      });
    }

    // Completion rate achievements
    const highPerformanceHabits = habits.filter(h => h.completionRate >= 80);
    if (highPerformanceHabits.length >= 1) {
      achievements.push({
        id: 'consistent-performer',
        title: 'Consistent Performer',
        description: 'Achieved 80%+ completion rate on a habit',
        icon: 'fas fa-target',
        color: 'yellow',
        unlocked: true,
        rarity: 'uncommon'
      });
    }

    // Perfect day achievements
    if (stats.todayProgress === 100) {
      achievements.push({
        id: 'perfect-day',
        title: 'Perfect Day',
        description: 'Completed all habits in a single day',
        icon: 'fas fa-gem',
        color: 'rainbow',
        unlocked: true,
        rarity: 'rare'
      });
    }

    // Long-term inspirational achievements (for 5+ year users)
    achievements.push(
      // Year-based milestones
      {
        id: 'foundation-year',
        title: 'The Foundation',
        description: 'Complete 365 days of habit tracking - You\'ve built the foundation of lasting change',
        icon: 'fas fa-mountain',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'life-transformer',
        title: 'Life Transformer',
        description: '2 years of dedication - You\'ve fundamentally transformed your daily life',
        icon: 'fas fa-phoenix-alt',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'habit-sage',
        title: 'Habit Sage',
        description: '3 years of wisdom - You\'ve become a master of your own destiny',
        icon: 'fas fa-infinity',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'legacy-builder',
        title: 'Legacy Builder',
        description: '4 years of commitment - You\'re building a legacy of excellence',
        icon: 'fas fa-monument',
        color: 'purple',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'diamond-dedication',
        title: 'Diamond Dedication',
        description: '5 years of unwavering commitment - You are diamond-forged through consistency',
        icon: 'fas fa-gem',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'time-guardian',
        title: 'Time Guardian',
        description: '6 years of mastery - You\'ve become a guardian of your own time and habits',
        icon: 'fas fa-hourglass-end',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'eternal-champion',
        title: 'Eternal Champion',
        description: '7+ years of dedication - You\'ve achieved eternal champion status in life mastery',
        icon: 'fas fa-crown',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'legendary-soul',
        title: 'Legendary Soul',
        description: '10+ years of transformation - You are a legendary soul who inspires others',
        icon: 'fas fa-star',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      
      // Special long-term achievements
      {
        id: 'perfect-year',
        title: 'Perfect Year',
        description: 'Complete all habits every day for an entire year - The ultimate dedication',
        icon: 'fas fa-certificate',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'habit-architect',
        title: 'Habit Architect',
        description: 'Create and maintain 50+ different habits over your journey',
        icon: 'fas fa-hammer',
        color: 'purple',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'streak-legend',
        title: 'Streak Legend',
        description: 'Achieve a 1000-day streak on any habit - You are unstoppable',
        icon: 'fas fa-fire',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'life-artist',
        title: 'Life Artist',
        description: '5 years of creative habit building - You\'ve painted your life as a masterpiece',
        icon: 'fas fa-palette',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      
      // Original achievements for shorter-term motivation
      {
        id: 'century-streak',
        title: 'Century Club',
        description: 'Complete habits for 100 days in a row',
        icon: 'fas fa-medal',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'habit-legend',
        title: 'Habit Legend',
        description: 'Create 25 different habits',
        icon: 'fas fa-dragon',
        color: 'rainbow',
        unlocked: false,
        rarity: 'legendary'
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% completion rate for 30 days',
        icon: 'fas fa-infinity',
        color: 'gold',
        unlocked: false,
        rarity: 'legendary'
      }
    );

    return achievements;
  };

  const achievements = generateAchievements();
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  // Separate long-term inspirational achievements
  const longTermAchievements = lockedAchievements.filter(a => 
    ['foundation-year', 'life-transformer', 'habit-sage', 'legacy-builder', 'diamond-dedication', 
     'time-guardian', 'eternal-champion', 'legendary-soul', 'perfect-year', 'habit-architect', 
     'streak-legend', 'life-artist'].includes(a.id)
  );
  const otherLockedAchievements = lockedAchievements.filter(a => 
    !['foundation-year', 'life-transformer', 'habit-sage', 'legacy-builder', 'diamond-dedication', 
      'time-guardian', 'eternal-champion', 'legendary-soul', 'perfect-year', 'habit-architect', 
      'streak-legend', 'life-artist'].includes(a.id)
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getIconColor = (color: string, unlocked: boolean) => {
    if (!unlocked) return 'text-gray-400';
    
    switch (color) {
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      case 'purple': return 'text-purple-500';
      case 'yellow': return 'text-yellow-500';
      case 'orange': return 'text-orange-500';
      case 'red': return 'text-red-500';
      case 'gold': return 'text-yellow-400';
      case 'rainbow': return 'text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text';
      default: return 'text-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
        <div className="p-4 pt-6 space-y-4">
          <div className="flex items-center space-x-2 mb-6">
            <Trophy className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-12 h-12 rounded-full mx-auto mb-3" />
                  <Skeleton className="h-4 w-24 mx-auto mb-2" />
                  <Skeleton className="h-3 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="p-4 pt-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <Trophy className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h1>
        </div>

        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Your Progress</h3>
                <p className="text-sm opacity-90">
                  {unlockedAchievements.length} of {achievements.length} achievements unlocked
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{unlockedAchievements.length}</div>
                <div className="text-sm opacity-90">Unlocked</div>
              </div>
            </div>
            <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Unlocked Achievements */}
        {unlockedAchievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span>Unlocked Achievements</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {unlockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent ${getRarityColor(achievement.rarity)}`}></div>
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${getIconColor(achievement.color, true)}`}>
                      <i className={`${achievement.icon} text-xl`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                      {achievement.description}
                    </p>
                    <Badge 
                      variant="secondary" 
                      className="mt-2 text-xs capitalize"
                    >
                      {achievement.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Long-Term Journey Achievements */}
        {longTermAchievements.length > 0 && (
          <div>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-pink-400 mb-2">
                Long-Term Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Inspirational achievements for dedicated users who commit to years of growth
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {longTermAchievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                      Epic Journey
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0">
                        <i className={`${achievement.icon} text-xl`}></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-base">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {achievement.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-3">
                          <Badge 
                            variant="outline" 
                            className="text-xs capitalize border-purple-300 text-purple-600 dark:border-purple-600 dark:text-purple-400"
                          >
                            {achievement.rarity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Other Locked Achievements */}
        {otherLockedAchievements.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
              <Target className="h-5 w-5 text-gray-500" />
              <span>Upcoming Goals</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {otherLockedAchievements.map((achievement) => (
                <Card key={achievement.id} className="relative overflow-hidden opacity-60">
                  <div className={`absolute top-0 right-0 w-0 h-0 border-l-[20px] border-b-[20px] border-l-transparent ${getRarityColor(achievement.rarity)}`}></div>
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                      <i className={`${achievement.icon} text-xl`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-600 dark:text-gray-400 mb-1 text-sm">
                      {achievement.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-500 leading-tight">
                      {achievement.description}
                    </p>
                    <Badge 
                      variant="outline" 
                      className="mt-2 text-xs capitalize border-gray-300 text-gray-500"
                    >
                      {achievement.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Card */}
        {stats && (
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Keep Going!</h3>
                  <p className="text-sm opacity-90">
                    {stats.currentStreak > 0 
                      ? `You're on a ${stats.currentStreak} day streak. Don't break it now!`
                      : "Start a new streak today and unlock more achievements!"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
