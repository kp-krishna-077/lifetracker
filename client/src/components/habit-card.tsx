import { useState } from "react";
import { HabitWithStats } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { 
  getHabitColor, 
  getHabitButtonColor, 
  formatStreak, 
  getProgressPercentage, 
  getProgressDisplay,
  getTodayDateString 
} from "@/lib/habit-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Minus, Plus, Check, RotateCcw } from "lucide-react";

interface HabitCardProps {
  habit: HabitWithStats;
}

export function HabitCard({ habit }: HabitCardProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const completionMutation = useMutation({
    mutationFn: async (data: { completed: boolean; value?: number }) => {
      return apiRequest("POST", `/api/habits/${habit.id}/entries`, {
        date: getTodayDateString(),
        completed: data.completed,
        value: data.value || 0,
        notes: data.completed ? "Completed via app" : ""
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Habit updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update habit",
        variant: "destructive",
      });
    },
  });

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      if (habit.type === "boolean") {
        await completionMutation.mutateAsync({ 
          completed: !habit.todayEntry?.completed 
        });
      } else {
        // For count/time habits, mark as complete with target value
        await completionMutation.mutateAsync({ 
          completed: true, 
          value: habit.target 
        });
      }
    } finally {
      setIsCompleting(false);
    }
  };

  const handleIncrement = async () => {
    const currentValue = habit.todayEntry?.value || 0;
    const newValue = currentValue + 1;
    
    await completionMutation.mutateAsync({
      completed: newValue >= habit.target,
      value: newValue
    });
  };

  const handleDecrement = async () => {
    const currentValue = habit.todayEntry?.value || 0;
    const newValue = Math.max(0, currentValue - 1);
    
    await completionMutation.mutateAsync({
      completed: newValue >= habit.target,
      value: newValue
    });
  };

  const progressPercentage = getProgressPercentage(habit);
  const isCompleted = habit.todayEntry?.completed || false;
  const currentValue = habit.todayEntry?.value || 0;

  return (
    <Card className="habit-card bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-md transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getHabitColor(habit.color)}`}>
              <i className={`${habit.icon} text-lg`}></i>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {habit.name}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <span>{formatStreak(habit.currentStreak)}</span>
                <span>•</span>
                <span>{getProgressDisplay(habit)}</span>
              </div>
              
              {habit.type !== "boolean" && (
                <div className="mt-2">
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 ml-3">
            {habit.type === "count" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDecrement}
                  disabled={completionMutation.isPending || currentValue <= 0}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleIncrement}
                  disabled={completionMutation.isPending}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </>
            )}
            
            <Button
              size="sm"
              onClick={handleComplete}
              disabled={completionMutation.isPending || isCompleting}
              className={`w-10 h-10 p-0 text-white transition-all transform hover:scale-105 ${
                isCompleted
                  ? "bg-green-500 hover:bg-green-600"
                  : habit.currentStreak === 0
                  ? "bg-orange-500 hover:bg-orange-600"
                  : getHabitButtonColor(habit.color)
              }`}
            >
              {completionMutation.isPending || isCompleting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isCompleted ? (
                <Check className="h-4 w-4" />
              ) : habit.currentStreak === 0 ? (
                <RotateCcw className="h-4 w-4" />
              ) : (
                <Check className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
