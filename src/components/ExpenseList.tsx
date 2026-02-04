"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPaise } from "@/lib/utils";
import type { Expense } from "@/lib/types";

interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
}

export function ExpenseList({ expenses, isLoading, error }: ExpenseListProps) {
  if (error) {
    return (
      <p className="text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading expenses…</p>;
  }
  if (expenses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No expenses to show.</p>
    );
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.map((e) => (
          <TableRow key={e.id}>
            <TableCell>{e.date}</TableCell>
            <TableCell>{e.category}</TableCell>
            <TableCell>{e.description}</TableCell>
            <TableCell className="text-right">{formatPaise(e.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
