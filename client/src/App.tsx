import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { BottomNavigation } from "@/components/bottom-navigation";
import Dashboard from "@/pages/dashboard";
import Analytics from "@/pages/analytics";
import Calendar from "@/pages/calendar";
import Achievements from "@/pages/achievements";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-900 min-h-screen relative">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/achievements" component={Achievements} />
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="habitflow-theme">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
