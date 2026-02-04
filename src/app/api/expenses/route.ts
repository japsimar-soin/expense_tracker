import { NextRequest, NextResponse } from "next/server";
import * as expensesController from "@/controllers/expensesController";

export async function GET(req: NextRequest) {
  const res = await expensesController.getExpenses(req);
  return NextResponse.json(res.body, { status: res.status });
}

export async function POST(req: NextRequest) {
  const res = await expensesController.postExpense(req);
  return NextResponse.json(res.body, { status: res.status });
}
