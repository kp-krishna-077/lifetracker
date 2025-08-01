import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { 
  Home, 
  BarChart3, 
  Calendar, 
  Trophy,
  Plus
} from "lucide-react";

export function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/calendar", icon: Calendar, label: "Calendar" },
    { path: "/achievements", icon: Trophy, label: "Rewards" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 safe-area-bottom">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                size="sm"
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center space-y-1 h-auto py-2 px-3 ${
                  isActive 
                    ? "text-primary" 
                    : "text-gray-400 hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
}

export function FloatingActionButton({ onClick }: FloatingActionButtonProps) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50 transition-all transform hover:scale-110"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
