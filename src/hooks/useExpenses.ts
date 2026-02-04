"use client";

import { useState, useEffect, useCallback } from "react";
import type { Expense } from "@/lib/types";

export type SortOption = "date_desc" | "date_asc";

export interface UseExpensesParams {
  category?: string;
  sort?: SortOption;
}

export interface UseExpensesResult {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useExpenses(params: UseExpensesParams = {}): UseExpensesResult {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const searchParams = new URLSearchParams();
      if (params.category) searchParams.set("category", params.category);
      if (params.sort) searchParams.set("sort", params.sort);
      const url = `/api/expenses${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      setExpenses(data.expenses ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load expenses");
      setExpenses([]);
    } finally {
      setIsLoading(false);
    }
  }, [params.category, params.sort]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, isLoading, error, refetch: fetchExpenses };
}
