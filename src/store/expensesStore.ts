import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { Expense, ExpensesFile } from "@/lib/types";

const DATA_DIR = "data";
const FILENAME = "expenses.json";

function getFilePath(): string {
  return path.join(process.cwd(), DATA_DIR, FILENAME);
}

let writePromise: Promise<void> = Promise.resolve();

async function ensureFile(): Promise<void> {
  const filePath = getFilePath();
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true }).catch(() => {});
  try {
    await readFile(filePath, "utf-8");
  } catch {
    const initial: ExpensesFile = { expenses: [], idempotencyKeys: {} };
    await writeFile(filePath, JSON.stringify(initial, null, 2), "utf-8");
  }
}

export async function readExpensesFile(): Promise<ExpensesFile> {
  await ensureFile();
  const filePath = getFilePath();
  const raw = await readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as ExpensesFile;
  if (!Array.isArray(data.expenses)) data.expenses = [];
  if (!data.idempotencyKeys || typeof data.idempotencyKeys !== "object")
    data.idempotencyKeys = {};
  return data;
}

export async function writeExpensesFile(data: ExpensesFile): Promise<void> {
  const filePath = getFilePath();
  const next = writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  writePromise = writePromise.then(() => next);
  await next;
}

export async function getIdempotencyExpenseId(
  key: string
): Promise<string | null> {
  const data = await readExpensesFile();
  const entry = data.idempotencyKeys[key];
  return entry ? entry.expenseId : null;
}

export async function appendExpense(
  expense: Expense,
  idempotencyKey?: string
): Promise<void> {
  const data = await readExpensesFile();
  data.expenses.push(expense);
  if (idempotencyKey) {
    data.idempotencyKeys[idempotencyKey] = {
      expenseId: expense.id,
      createdAt: expense.created_at,
    };
  }
  await writeExpensesFile(data);
}

export async function getExpenseById(id: string): Promise<Expense | null> {
  const data = await readExpensesFile();
  return data.expenses.find((e) => e.id === id) ?? null;
}
