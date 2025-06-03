"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  onSubmit: (data: any) => void;
}

const categoryIcons = [
  "🍔",
  "🛒",
  "⛽",
  "🏠",
  "💡",
  "📱",
  "🎬",
  "🏥",
  "✈️",
  "🎓",
  "👕",
  "🚗",
  "💰",
  "🎁",
  "📚",
  "🍕",
  "☕",
  "🏋️",
  "💊",
  "🎵",
];

const categoryColors = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
  "#F97316",
  "#6366F1",
];

export function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "EXPENSE" as "INCOME" | "EXPENSE",
    icon: "📝",
    color: "#3B82F6",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    onSubmit(formData);
    setFormData({
      name: "",
      type: "EXPENSE",
      icon: "📝",
      color: "#3B82F6",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          placeholder="Enter category name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "INCOME" | "EXPENSE") =>
            setFormData({ ...formData, type: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Income</SelectItem>
            <SelectItem value="EXPENSE">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <div className="grid grid-cols-10 gap-2">
          {categoryIcons.map((icon) => (
            <button
              key={icon}
              type="button"
              className={`p-2 text-lg border rounded hover:bg-gray-100 ${
                formData.icon === icon ? "bg-blue-100 border-blue-500" : ""
              }`}
              onClick={() => setFormData({ ...formData, icon })}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Color</Label>
        <div className="grid grid-cols-10 gap-2">
          {categoryColors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded border-2 ${
                formData.color === color ? "border-gray-800" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              onClick={() => setFormData({ ...formData, color })}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create Category
      </Button>
    </form>
  );
}
