import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertHabit } from "@shared/schema";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const habitIcons = [
  // Health & Fitness
  { icon: "fas fa-dumbbell", color: "blue", label: "Exercise", category: "fitness" },
  { icon: "fas fa-running", color: "green", label: "Running", category: "fitness" },
  { icon: "fas fa-bicycle", color: "yellow", label: "Cycling", category: "fitness" },
  { icon: "fas fa-swimmer", color: "blue", label: "Swimming", category: "fitness" },
  { icon: "fas fa-hiking", color: "green", label: "Hiking", category: "fitness" },
  { icon: "fas fa-heart", color: "red", label: "Cardio", category: "fitness" },
  { icon: "fas fa-weight", color: "indigo", label: "Strength", category: "fitness" },
  
  // Wellness & Self-Care
  { icon: "fas fa-meditation", color: "purple", label: "Meditation", category: "wellness" },
  { icon: "fas fa-spa", color: "pink", label: "Self-Care", category: "wellness" },
  { icon: "fas fa-bed", color: "indigo", label: "Sleep", category: "wellness" },
  { icon: "fas fa-leaf", color: "green", label: "Mindfulness", category: "wellness" },
  { icon: "fas fa-smile", color: "yellow", label: "Gratitude", category: "wellness" },
  { icon: "fas fa-sun", color: "orange", label: "Morning Routine", category: "wellness" },
  
  // Nutrition & Health
  { icon: "fas fa-apple-alt", color: "red", label: "Healthy Eating", category: "nutrition" },
  { icon: "fas fa-tint", color: "blue", label: "Water", category: "nutrition" },
  { icon: "fas fa-carrot", color: "orange", label: "Vegetables", category: "nutrition" },
  { icon: "fas fa-pills", color: "green", label: "Vitamins", category: "nutrition" },
  { icon: "fas fa-ban-smoking", color: "red", label: "No Smoking", category: "nutrition" },
  
  // Learning & Productivity
  { icon: "fas fa-book-open", color: "blue", label: "Reading", category: "learning" },
  { icon: "fas fa-graduation-cap", color: "purple", label: "Study", category: "learning" },
  { icon: "fas fa-code", color: "green", label: "Coding", category: "learning" },
  { icon: "fas fa-language", color: "pink", label: "Language", category: "learning" },
  { icon: "fas fa-brain", color: "purple", label: "Learning", category: "learning" },
  { icon: "fas fa-tasks", color: "indigo", label: "Productivity", category: "learning" },
  
  // Creative & Hobbies
  { icon: "fas fa-brush", color: "pink", label: "Art", category: "creative" },
  { icon: "fas fa-music", color: "purple", label: "Music", category: "creative" },
  { icon: "fas fa-camera", color: "green", label: "Photography", category: "creative" },
  { icon: "fas fa-pen", color: "blue", label: "Writing", category: "creative" },
  { icon: "fas fa-guitar", color: "orange", label: "Guitar", category: "creative" },
  { icon: "fas fa-palette", color: "red", label: "Drawing", category: "creative" },
  
  // Social & Relationships
  { icon: "fas fa-users", color: "blue", label: "Social", category: "social" },
  { icon: "fas fa-phone", color: "green", label: "Call Family", category: "social" },
  { icon: "fas fa-heart", color: "red", label: "Relationship", category: "social" },
  { icon: "fas fa-hands-helping", color: "purple", label: "Help Others", category: "social" },
  
  // Work & Finance
  { icon: "fas fa-briefcase", color: "indigo", label: "Work", category: "work" },
  { icon: "fas fa-dollar-sign", color: "green", label: "Save Money", category: "work" },
  { icon: "fas fa-chart-line", color: "blue", label: "Invest", category: "work" },
  { icon: "fas fa-file-alt", color: "gray", label: "Planning", category: "work" },
  
  // Environment & Home
  { icon: "fas fa-home", color: "brown", label: "Home Care", category: "home" },
  { icon: "fas fa-recycle", color: "green", label: "Recycle", category: "home" },
  { icon: "fas fa-broom", color: "blue", label: "Cleaning", category: "home" },
  { icon: "fas fa-seedling", color: "green", label: "Gardening", category: "home" },
  
  // Miscellaneous
  { icon: "fas fa-star", color: "yellow", label: "General", category: "misc" },
  { icon: "fas fa-target", color: "red", label: "Goal", category: "misc" },
  { icon: "fas fa-check", color: "green", label: "Todo", category: "misc" },
  { icon: "fas fa-calendar", color: "blue", label: "Schedule", category: "misc" },
];

const colorOptions = [
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "gray", label: "Gray", class: "bg-gray-500" },
  { value: "brown", label: "Brown", class: "bg-amber-700" },
];

export function AddHabitModal({ open, onOpenChange }: AddHabitModalProps) {
  const [formData, setFormData] = useState<InsertHabit>({
    name: "",
    description: "",
    icon: "fas fa-star",
    color: "blue",
    type: "boolean",
    target: 1,
    frequency: "daily",
    frequencyData: null,
    isActive: true,
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentStep, setCurrentStep] = useState(1);

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createHabitMutation = useMutation({
    mutationFn: async (habitData: InsertHabit) => {
      return apiRequest("POST", "/api/habits", habitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/habits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success!",
        description: "Habit created successfully",
      });
      onOpenChange(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create habit",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "fas fa-star",
      color: "blue",
      type: "boolean",
      target: 1,
      frequency: "daily",
      frequencyData: null,
      isActive: true,
    });
    setCurrentStep(1);
    setSelectedCategory("all");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Habit name is required",
        variant: "destructive",
      });
      return;
    }
    createHabitMutation.mutate(formData);
  };

  const handleIconSelect = (icon: string, color: string) => {
    setFormData(prev => ({ ...prev, icon, color }));
  };

  const filteredIcons = selectedCategory === "all" 
    ? habitIcons 
    : habitIcons.filter(icon => icon.category === selectedCategory);

  const categories = [
    { value: "all", label: "All", icon: "fas fa-th" },
    { value: "fitness", label: "Fitness", icon: "fas fa-dumbbell" },
    { value: "wellness", label: "Wellness", icon: "fas fa-spa" },
    { value: "nutrition", label: "Health", icon: "fas fa-apple-alt" },
    { value: "learning", label: "Learning", icon: "fas fa-brain" },
    { value: "creative", label: "Creative", icon: "fas fa-palette" },
    { value: "social", label: "Social", icon: "fas fa-users" },
    { value: "work", label: "Work", icon: "fas fa-briefcase" },
    { value: "home", label: "Home", icon: "fas fa-home" },
    { value: "misc", label: "Other", icon: "fas fa-star" },
  ];

  const getHabitColor = (color: string) => {
    const colorMap: Record<string, string> = {
      red: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
      green: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
      gray: "bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400",
      brown: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Habit</span>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full ${currentStep >= 1 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <div className={`w-2 h-2 rounded-full ${currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
            </div>
          </DialogTitle>
          <DialogDescription>
            Create a personalized habit that fits your lifestyle and goals
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Basic Information
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Let's start with the basics</p>
              </div>
              
              <div>
                <Label htmlFor="name">Habit Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Morning Yoga, Read 20 Pages, Drink 8 Glasses of Water"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add more details about your habit, why it's important to you, or any notes..."
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="mt-1 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.name.trim()}
                  className="flex items-center gap-2"
                >
                  Next: Choose Icon
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Icon & Color Selection */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  Choose Your Style
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pick an icon and color that represents your habit</p>
              </div>

              {/* Category Filter */}
              <div>
                <Label>Category</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {categories.map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setSelectedCategory(category.value)}
                      className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                        selectedCategory === category.value
                          ? 'border-blue-500 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' 
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      <i className={`${category.icon} text-sm mb-1`}></i>
                      <div>{category.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selection */}
              <div>
                <Label>Choose Icon ({filteredIcons.length} available)</Label>
                <div className="grid grid-cols-6 gap-2 mt-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                  {filteredIcons.map((habitIcon, index) => (
                    <button
                      key={`${habitIcon.icon}-${index}`}
                      type="button"
                      onClick={() => handleIconSelect(habitIcon.icon, habitIcon.color)}
                      className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                        formData.icon === habitIcon.icon 
                          ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800' 
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                      } ${getHabitColor(habitIcon.color)}`}
                      title={habitIcon.label}
                    >
                      <i className={`${habitIcon.icon} text-lg`}></i>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Override */}
              <div>
                <Label>Custom Color (Optional)</Label>
                <div className="grid grid-cols-10 gap-2 mt-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${color.class} ${
                        formData.color === color.value ? 'border-gray-900 dark:border-white ring-2 ring-offset-2' : 'border-gray-300'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <Card className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Preview</Label>
                  <div className="flex items-center space-x-3 mt-2">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getHabitColor(formData.color)}`}>
                      <i className={`${formData.icon} text-lg`}></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{formData.name || "Your Habit"}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formData.description || "No description"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                  className="flex-1 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 flex items-center gap-2"
                >
                  Next: Settings
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Settings */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-500" />
                  Habit Settings
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Configure how you want to track this habit</p>
              </div>

              <div>
                <Label htmlFor="type">Tracking Type</Label>
                <Select value={formData.type} onValueChange={(value: "boolean" | "count" | "time") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boolean">
                      <div className="flex items-center gap-2">
                        <span>✓</span>
                        <div>
                          <div className="font-medium">Simple (Done or Not Done)</div>
                          <div className="text-xs text-gray-500">Perfect for habits like 'Meditate' or 'Take vitamins'</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="count">
                      <div className="flex items-center gap-2">
                        <span>🔢</span>
                        <div>
                          <div className="font-medium">Count Target</div>
                          <div className="text-xs text-gray-500">Great for countable activities like push-ups or pages read</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="time">
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <div>
                          <div className="font-medium">Time Target</div>
                          <div className="text-xs text-gray-500">Ideal for time-based activities like exercise or study</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(formData.type === "count" || formData.type === "time") && (
                <div>
                  <Label htmlFor="target">
                    Daily Target ({formData.type === "count" ? "Count" : "Minutes"})
                  </Label>
                  <Input
                    id="target"
                    type="number"
                    min="1"
                    value={formData.target || 1}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      target: parseInt(e.target.value) || 1 
                    }))}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Set a realistic daily target that challenges you but remains achievable
                  </p>
                </div>
              )}

              {/* Final Preview */}
              <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Final Preview</Label>
                  <div className="flex items-start space-x-3 mt-2">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${getHabitColor(formData.color)} flex-shrink-0`}>
                      <i className={`${formData.icon} text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">{formData.name}</h4>
                      {formData.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{formData.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {formData.type === "boolean" ? "Simple Tracking" : 
                           formData.type === "count" ? `Target: ${formData.target}` : 
                           `Target: ${formData.target} min`}
                        </Badge>
                        <Badge variant="outline" className="text-xs">Daily</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="flex-1 flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  disabled={createHabitMutation.isPending || !formData.name.trim()}
                >
                  {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
                </Button>
              </div>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}