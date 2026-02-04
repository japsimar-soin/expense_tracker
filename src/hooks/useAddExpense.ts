"use client";

import { useState, useCallback } from "react";
import type { Expense, CreateExpenseBody } from "@/lib/types";

function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface UseAddExpenseResult {
  addExpense: (
    body: CreateExpenseBody,
    idempotencyKey?: string
  ) => Promise<Expense | null>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  generateIdempotencyKey: () => string;
}

export function useAddExpense(onSuccess?: () => void): UseAddExpenseResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addExpense = useCallback(
    async (
      body: CreateExpenseBody,
      idempotencyKey?: string
    ): Promise<Expense | null> => {
      setIsLoading(true);
      setError(null);
      const key = idempotencyKey ?? generateIdempotencyKey();
      try {
        const res = await fetch("/api/expenses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Idempotency-Key": key,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || `Request failed: ${res.status}`);
        }
        onSuccess?.();
        return data as Expense;
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to add expense";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [onSuccess]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    addExpense,
    isLoading,
    error,
    clearError,
    generateIdempotencyKey,
  };
}
