# Expense Tracker

A small personal finance tool to record and review expenses. You can add expenses, view a list, filter by category, sort by date, and see the total of the visible list.

## What this project is

- **Backend:** Node.js API (Next.js API routes) with `POST /api/expenses` and `GET /api/expenses`.
- **Frontend:** Simple web UI (Next.js + ShadCN) with a form to add expenses, a list/table, category filter, date sort (newest first by default), and a total for the current list.
- **Storage:** A JSON file on disk (`data/expenses.json`) so data survives server restarts.

## Tech stack

- **Next.js 14** (App Router) – frontend and API routes.
- **ShadCN** – UI components (Button, Input, Select, Table, Label).
- **TypeScript** – for the whole project.
- **Storage** – JSON file in `data/expenses.json` (no database).

## Why a JSON file?

- Data is kept across restarts (unlike in-memory only).
- No database setup or extra process.
- Easy to backup and inspect the file.
- Fits a small, single-user tool that you might extend later.

## Design decisions

1. **Money in paise** – Amounts are stored and sent as integers (paise). The UI shows rupees (₹). This avoids floating-point rounding issues.
2. **Idempotency** – For safe retries (double submit, refresh, slow network), the client sends an `Idempotency-Key` header (e.g. a UUID). If the server has already seen that key, it returns the same expense with status 200 instead of creating a duplicate.
3. **Folder structure** – Separate layers: API route → controller → service → store; plus `lib` (types, validation, utils), `hooks` (data fetching/mutation), `components` (UI only). Each part has a single responsibility.
4. **Total** – The “Total: ₹X” is the sum of the **currently visible** expenses (after filter and sort), computed on the client from the list returned by the API.

## Setup

- **Node:** Use Node 18 or newer.
- **Install:** From the project root run:
  ```bash
  npm install
  ```
- **Data file:** The app creates `data/expenses.json` on first use if it does not exist. You can also create it yourself with:
  ```json
  {"expenses":[],"idempotencyKeys":{}}
  ```

## How to run

- **Development:**
  ```bash
  npm run dev
  ```
  Then open [http://localhost:3000](http://localhost:3000).

- **Build and start (production):**
  ```bash
  npm run build
  npm start
  ```

## API (summary)

- **POST /api/expenses**  
  Body: `{ "amount": number, "category": string, "description": string, "date": "YYYY-MM-DD" }`  
  `amount` is in paise.  
  Optional header: `Idempotency-Key: <uuid>` for retry-safe creates.  
  Returns the created (or existing) expense; 201 when created, 200 when idempotent replay.

- **GET /api/expenses**  
  Query: `category` (optional), `sort=date_desc` or `sort=date_asc` (optional; default newest first).  
  Returns `{ "expenses": Expense[] }`.

## Trade-offs and not done

- **Idempotency keys** – Stored in the same JSON file with no TTL. Keys are not expired.
- **No auth** – Too overkill for a simple implementation as such.
- **Concurrency** – Writes are serialized per process to avoid corrupting the JSON file. Multiple processes writing at once would need external locking or a different store.
- **JSON files for storage** - To ensure simplicity as the app is a **Personal** expense tracker, which means it is not being used at scale currently.

## Folder structure (high level)

- `src/app` – Next.js pages and API routes (`/api/expenses`).
- `src/controllers` – Request/response handling for expenses.
- `src/services` – Business logic (create, list, filter, sort).
- `src/store` – Reading/writing the JSON file and idempotency map.
- `src/lib` – Types, validation, utils (e.g. currency formatting).
- `src/hooks` – `useExpenses`, `useAddExpense`.
- `src/components` – UI (form, list, filters, total) and ShadCN `ui/`.
- `data/` – `expenses.json` for persisted data.
