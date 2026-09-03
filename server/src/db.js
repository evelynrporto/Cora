import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '..', 'data', 'financeapp.db')

export const db = new DatabaseSync(dbPath)

// Categories, monthly totals and the month-over-month change are all derived
// from `transactions` at query time (see index.js) rather than stored
// separately, so every widget stays in sync whenever a transaction changes.
db.exec(`
  CREATE TABLE IF NOT EXISTS cards (
    id TEXT PRIMARY KEY,
    bank_name TEXT NOT NULL,
    card_type TEXT NOT NULL,
    last_digits TEXT NOT NULL,
    available_limit REAL NOT NULL,
    colorway TEXT NOT NULL,
    sort_order INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS transactions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    amount REAL NOT NULL,
    date TEXT NOT NULL,
    is_recurring INTEGER NOT NULL DEFAULT 0,
    icon TEXT NOT NULL
  );
`)
