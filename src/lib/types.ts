/**
 * Expense entity as stored and returned by the API
 * amount is in paise to avoid float rounding
 */
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  created_at: string;
}

/**
 * Request body for creating an expense
 * amount: int paise
 * date: YYYY-MM-DD
 */
export interface CreateExpenseBody {
  amount: number;
  category: string;
  description: string;
  date: string;
}

// Persisted file shape: expenses array and idempotency key map

export interface ExpensesFile {
  expenses: Expense[];
  idempotencyKeys: Record<
    string,
    { expenseId: string; createdAt: string }
  >;
}
