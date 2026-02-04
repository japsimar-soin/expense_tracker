"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExpenseFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortDateDesc: boolean;
  onSortChange: (dateDesc: boolean) => void;
}

export function ExpenseFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  sortDateDesc,
  onSortChange,
}: ExpenseFiltersProps) {
  const categoryOptions = Array.from(new Set(categories)).sort();

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="grid gap-2 min-w-[140px]">
        <Label>Category</Label>
        <Select
          value={selectedCategory || "all"}
          onValueChange={(v) => onCategoryChange(v === "all" ? "" : v)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2 min-w-[140px]">
        <Label>Sort by date</Label>
        <Select
          value={sortDateDesc ? "date_desc" : "date_asc"}
          onValueChange={(v) => onSortChange(v === "date_desc")}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest first</SelectItem>
            <SelectItem value="date_asc">Oldest first</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
