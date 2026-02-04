"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CreateExpenseBody } from "@/lib/types";
import type { UseAddExpenseResult } from "@/hooks/useAddExpense";

interface AddExpenseFormProps {
  addExpense: UseAddExpenseResult["addExpense"];
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  generateIdempotencyKey: () => string;
  onSuccess: () => void;
}

const defaultFormState = {
  amount: "",
  category: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
};

export function AddExpenseForm({
  addExpense,
  isLoading,
  error,
  clearError,
  generateIdempotencyKey,
  onSuccess,
}: AddExpenseFormProps) {
  const [form, setForm] = useState(defaultFormState);
  const idempotencyKeyRef = useRef<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(form.amount);
    if (Number.isNaN(amountNum) || amountNum < 0) {
      return;
    }
    const paise = Math.round(amountNum * 100);
    const body: CreateExpenseBody = {
      amount: paise,
      category: form.category.trim(),
      description: form.description.trim(),
      date: form.date,
    };
    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = generateIdempotencyKey();
    }
    const key = idempotencyKeyRef.current;
    const result = await addExpense(body, key);
    if (result) {
      idempotencyKeyRef.current = null;
      setForm(defaultFormState);
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div className="grid gap-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => {
            setForm((f) => ({ ...f, amount: e.target.value }));
            if (error) clearError();
          }}
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="category">Category</Label>
        <Input
          id="category"
          type="text"
          placeholder="e.g. Food, Transport"
          value={form.category}
          onChange={(e) => {
            setForm((f) => ({ ...f, category: e.target.value }));
            if (error) clearError();
          }}
          disabled={isLoading}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          type="text"
          placeholder="Optional description"
          value={form.description}
          onChange={(e) => {
            setForm((f) => ({ ...f, description: e.target.value }));
            if (error) clearError();
          }}
          disabled={isLoading}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={form.date}
          onChange={(e) => {
            setForm((f) => ({ ...f, date: e.target.value }));
            if (error) clearError();
          }}
          disabled={isLoading}
          required
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding…" : "Add expense"}
      </Button>
    </form>
  );
}
