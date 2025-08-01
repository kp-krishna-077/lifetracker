import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { HabitEntry } from "@shared/schema";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get entries for the current month
  const { data: entries, isLoading } = useQuery<HabitEntry[]>({
    queryKey: ["/api/entries", currentYear, currentMonth],
    queryFn: async () => {
      const startDate = new Date(currentYear, currentMonth, 1).toISOString().split('T')[0];
      const endDate = new Date(currentYear, currentMonth + 1, 0).toISOString().split('T')[0];
      
      const response = await fetch(`/api/entries?startDate=${startDate}&endDate=${endDate}`);
      return response.json();
    },
  });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getEntriesForDate = (date: string) => {
    return entries?.filter(entry => entry.date === date) || [];
  };

  const getCompletionStatusForDate = (date: string) => {
    const dayEntries = getEntriesForDate(date);
    if (dayEntries.length === 0) return 'none';
    
    const completedCount = dayEntries.filter(entry => entry.completed).length;
    const totalCount = dayEntries.length;
    
    if (completedCount === 0) return 'missed';
    if (completedCount === totalCount) return 'completed';
    return 'partial';
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const today = new Date().toISOString().split('T')[0];
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
      const status = getCompletionStatusForDate(date);
      const isToday = date === today;
      const dayEntries = getEntriesForDate(date);
      
      days.push(
        <div
          key={day}
          className={`p-2 h-12 border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-sm relative ${
            isToday ? "bg-primary text-white rounded-lg" : ""
          }`}
        >
          <span className={`font-medium ${isToday ? "text-white" : "text-gray-900 dark:text-white"}`}>
            {day}
          </span>
          {status !== 'none' && !isToday && (
            <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
              status === 'completed' ? 'bg-green-500' :
              status === 'partial' ? 'bg-yellow-500' :
              'bg-red-500'
            }`}></div>
          )}
          {dayEntries.length > 0 && isToday && (
            <div className="w-1.5 h-1.5 rounded-full mt-0.5 bg-white"></div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate month stats
  const monthEntries = entries || [];
  const totalDaysWithHabits = new Set(monthEntries.map(entry => entry.date)).size;
  const completedDays = new Set(
    monthEntries.filter(entry => entry.completed).map(entry => entry.date)
  ).size;
  const completionRate = totalDaysWithHabits > 0 ? Math.round((completedDays / totalDaysWithHabits) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20">
      <div className="p-4 pt-6 space-y-6">
        <div className="flex items-center space-x-2 mb-6">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar</h1>
        </div>

        {/* Month Navigation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <CardTitle className="text-lg">
                {monthNames[currentMonth]} {currentYear}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="grid grid-cols-7 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                      <Skeleton key={col} className="h-12 w-full" />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day) => (
                    <div key={day} className="p-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendarGrid()}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Month Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-1">{totalDaysWithHabits}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">{completedDays}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Perfect Days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500 mb-1">{completionRate}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">All habits completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Some habits completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">No habits completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-primary rounded-lg"></div>
                <span className="text-gray-600 dark:text-gray-400">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
