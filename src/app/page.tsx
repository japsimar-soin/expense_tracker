"use client";

import { useState } from "react";
import { useExpenses } from "@/hooks/useExpenses";
import { useAddExpense } from "@/hooks/useAddExpense";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseFilters } from "@/components/ExpenseFilters";
import { ExpenseTotal } from "@/components/ExpenseTotal";

export default function Home() {
  const [category, setCategory] = useState("");
  const [sortDateDesc, setSortDateDesc] = useState(true);

  const { expenses, isLoading, error, refetch } = useExpenses({
    category: category || undefined,
    sort: sortDateDesc ? "date_desc" : "date_asc",
  });

  const {
    addExpense,
    isLoading: isAdding,
    error: addError,
    clearError,
    generateIdempotencyKey,
  } = useAddExpense(refetch);

  const categories = expenses.map((e) => e.category);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Expense Tracker</h1>

      <section className="mb-8">
        <h2 className="text-lg font-medium mb-4">Add expense</h2>
        <AddExpenseForm
          addExpense={addExpense}
          isLoading={isAdding}
          error={addError}
          clearError={clearError}
          generateIdempotencyKey={generateIdempotencyKey}
          onSuccess={refetch}
        />
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-medium mb-4">Expenses</h2>
        <ExpenseFilters
          categories={categories}
          selectedCategory={category}
          onCategoryChange={setCategory}
          sortDateDesc={sortDateDesc}
          onSortChange={setSortDateDesc}
        />
      </section>

      <div className="mb-2">
        <ExpenseTotal expenses={expenses} />
      </div>

      <ExpenseList
        expenses={expenses}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
