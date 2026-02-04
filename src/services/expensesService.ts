import { randomUUID } from "crypto";
import type { Expense, CreateExpenseBody } from "@/lib/types";
import {
  readExpensesFile,
  getIdempotencyExpenseId,
  appendExpense,
  getExpenseById,
} from "@/store/expensesStore";

export type SortOption = "date_desc" | "date_asc";

export interface ListExpensesOptions {
  category?: string;
  sort?: SortOption;
}

export async function createExpense(
  body: CreateExpenseBody,
  idempotencyKey?: string
): Promise<{ expense: Expense; created: boolean }> {
  if (idempotencyKey) {
    const existingId = await getIdempotencyExpenseId(idempotencyKey);
    if (existingId) {
      const existing = await getExpenseById(existingId);
      if (existing) {
        return { expense: existing, created: false };
      }
    }
  }

  const now = new Date().toISOString();
  const expense: Expense = {
    id: randomUUID(),
    amount: body.amount,
    category: body.category,
    description: body.description,
    date: body.date,
    created_at: now,
  };
  await appendExpense(expense, idempotencyKey);
  return { expense, created: true };
}

export async function listExpenses(
  options: ListExpensesOptions
): Promise<Expense[]> {
  const data = await readExpensesFile();
  let list = [...data.expenses];

  if (options.category) {
    list = list.filter(
      (e) => e.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  if (options.sort === "date_asc") {
    list.sort(
      (a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  } else {
    list.sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  return list;
}
