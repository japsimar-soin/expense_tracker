"use client";

import { formatPaise } from "@/lib/utils";
import type { Expense } from "@/lib/types";

interface ExpenseTotalProps {
  expenses: Expense[];
}

export function ExpenseTotal({ expenses }: ExpenseTotalProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  return (
    <p className="text-sm font-medium">
      Total: {formatPaise(total)}
    </p>
  );
}
