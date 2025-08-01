import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { InsertHabit } from "@shared/schema";

interface AddHabitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const habitIcons = [
  { icon: "fas fa-dumbbell", color: "blue", label: "Exercise" },
  { icon: "fas fa-book-open", color: "green", label: "Reading" },
  { icon: "fas fa-meditation", color: "purple", label: "Meditation" },
  { icon: "fas fa-tint", color: "yellow", label: "Water" },
  { icon: "fas fa-heart", color: "red", label: "Health" },
  { icon: "fas fa-bed", color: "indigo", label: "Sleep" },
  { icon: "fas fa-apple-alt", color: "orange", label: "Nutrition" },
  { icon: "fas fa-music", color: "pink", label: "Music" },
  { icon: "fas fa-code", color: "blue", label: "Coding" },
  { icon: "fas fa-brush", color: "purple", label: "Art" },
  { icon: "fas fa-camera", color: "green", label: "Photography" },
  { icon: "fas fa-bicycle", color: "yellow", label: "Cycling" },
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              placeholder="e.g., Morning Yoga"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your habit..."
              value={formData.description || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1"
              rows={2}
            />
          </div>

          <div>
            <Label>Choose Icon & Color</Label>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {habitIcons.map((item, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleIconSelect(item.icon, item.color)}
                  className={`h-12 w-12 p-0 ${
                    formData.icon === item.icon && formData.color === item.color
                      ? "ring-2 ring-primary"
                      : ""
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.color === "blue" ? "bg-blue-100 text-blue-600" :
                    item.color === "green" ? "bg-green-100 text-green-600" :
                    item.color === "purple" ? "bg-purple-100 text-purple-600" :
                    item.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                    item.color === "red" ? "bg-red-100 text-red-600" :
                    item.color === "indigo" ? "bg-indigo-100 text-indigo-600" :
                    item.color === "orange" ? "bg-orange-100 text-orange-600" :
                    item.color === "pink" ? "bg-pink-100 text-pink-600" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    <i className={`${item.icon} text-sm`}></i>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Habit Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "boolean" | "count" | "time") => 
                  setFormData(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="count">Count</SelectItem>
                  <SelectItem value="time">Time (minutes)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.type === "count" || formData.type === "time") && (
              <div>
                <Label htmlFor="target">
                  Target {formData.type === "time" ? "(minutes)" : ""}
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
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createHabitMutation.isPending}
              className="flex-1"
            >
              {createHabitMutation.isPending ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
