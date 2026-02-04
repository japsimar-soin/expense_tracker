import type { CreateExpenseBody } from "./types";

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

const ISO_DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Validates create expense body: amount non-negative, date required and valid,
 * category and description non-empty
 */
export function validateCreateExpenseBody(
  body: unknown
): { valid: true; data: CreateExpenseBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be an object" };
  }
  const b = body as Record<string, unknown>;

  const amount = b.amount;
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return { valid: false, error: "amount must be a number" };
  }
  if (amount < 0) {
    return { valid: false, error: "amount must be non-negative" };
  }
  if (!Number.isInteger(amount)) {
    return { valid: false, error: "amount must be an integer (paise)" };
  }

  const date = b.date;
  if (typeof date !== "string" || !date.trim()) {
    return { valid: false, error: "date is required" };
  }
  if (!ISO_DATE_ONLY.test(date)) {
    return { valid: false, error: "date must be YYYY-MM-DD" };
  }

  const category = b.category;
  if (typeof category !== "string" || !category.trim()) {
    return { valid: false, error: "category is required" };
  }

  const description = b.description;
  if (typeof description !== "string") {
    return { valid: false, error: "description must be a string" };
  }

  return {
    valid: true,
    data: {
      amount: amount as number,
      category: (category as string).trim(),
      description: (description as string).trim(),
      date: date.trim(),
    },
  };
}
