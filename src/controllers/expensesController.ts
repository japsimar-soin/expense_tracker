import { NextRequest } from "next/server";
import { validateCreateExpenseBody } from "@/lib/validation";
import * as expensesService from "@/services/expensesService";

export interface ControllerResponse {
  status: number;
  body: unknown;
}

// GET /api/expenses — list with optional category and sort=date_desc.
export async function getExpenses(req: NextRequest): Promise<ControllerResponse> {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? undefined;
  const sortParam = searchParams.get("sort");
  const sort =
    sortParam === "date_asc" || sortParam === "date_desc"
      ? sortParam
      : "date_desc";

  const expenses = await expensesService.listExpenses({
    category,
    sort,
  });
  return { status: 200, body: { expenses } };
}

// POST /api/expenses — create expense.
export async function postExpense(req: NextRequest): Promise<ControllerResponse> {
  const idempotencyKey = req.headers.get("idempotency-key")?.trim() ?? undefined;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return { status: 400, body: { error: "Invalid JSON body" } };
  }

  const validation = validateCreateExpenseBody(body);
  if (!validation.valid) {
    return { status: 400, body: { error: validation.error } };
  }

  const { expense, created } = await expensesService.createExpense(
    validation.data,
    idempotencyKey
  );
  return {
    status: created ? 201 : 200,
    body: expense,
  };
}
