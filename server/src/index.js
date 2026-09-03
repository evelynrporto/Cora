import cors from 'cors'
import express from 'express'
import { colorForCategory } from './categoryColors.js'
import { db } from './db.js'
import { monthAbbreviations, monthNames } from './months.js'

const app = express()
app.use(cors())
app.use(express.json())

function rowToCard(row) {
  return {
    id: row.id,
    bankName: row.bank_name,
    cardType: row.card_type,
    lastDigits: row.last_digits,
    availableLimit: row.available_limit,
    colorway: row.colorway,
  }
}

function rowToTransaction(row) {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    amount: row.amount,
    date: row.date,
    isRecurring: Boolean(row.is_recurring),
    icon: row.icon,
  }
}

function round2(value) {
  return Math.round(value * 100) / 100
}

function deleteById(table, id) {
  return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id).changes > 0
}

/** "YYYY-MM" for the current month plus `offset` months (offset can be negative). */
function monthKeyOffset(offset) {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  return `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`
}

app.get('/api/cards', (req, res) => {
  const rows = db.prepare('SELECT * FROM cards ORDER BY sort_order').all()
  res.json(rows.map(rowToCard))
})

app.post('/api/cards', (req, res) => {
  const { count: sortOrder } = db
    .prepare('SELECT COUNT(*) AS count FROM cards')
    .get()

  const card = {
    id: crypto.randomUUID(),
    bankName: req.body.bankName,
    cardType: req.body.cardType,
    lastDigits: req.body.lastDigits,
    availableLimit: req.body.availableLimit,
    colorway: req.body.colorway,
  }

  db.prepare(
    `INSERT INTO cards (id, bank_name, card_type, last_digits, available_limit, colorway, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    card.id,
    card.bankName,
    card.cardType,
    card.lastDigits,
    card.availableLimit,
    card.colorway,
    sortOrder,
  )

  res.status(201).json(card)
})

app.patch('/api/cards/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM cards WHERE id = ?').get(req.params.id)
  if (!existing) {
    res.status(404).json({ error: 'Card not found' })
    return
  }

  const updated = { ...rowToCard(existing), ...req.body, id: existing.id }

  db.prepare(
    `UPDATE cards
     SET bank_name = ?, card_type = ?, last_digits = ?, available_limit = ?, colorway = ?
     WHERE id = ?`,
  ).run(
    updated.bankName,
    updated.cardType,
    updated.lastDigits,
    updated.availableLimit,
    updated.colorway,
    updated.id,
  )

  res.json(updated)
})

app.delete('/api/cards/:id', (req, res) => {
  if (!deleteById('cards', req.params.id)) {
    res.status(404).json({ error: 'Card not found' })
    return
  }
  res.json({ id: req.params.id })
})

app.get('/api/transactions', (req, res) => {
  const rows = db.prepare('SELECT * FROM transactions ORDER BY date DESC').all()
  res.json(rows.map(rowToTransaction))
})

app.post('/api/transactions', (req, res) => {
  const transaction = {
    id: crypto.randomUUID(),
    title: req.body.title,
    category: req.body.category,
    amount: req.body.amount,
    date: req.body.date,
    isRecurring: Boolean(req.body.isRecurring),
    icon: req.body.icon,
  }

  db.prepare(
    `INSERT INTO transactions (id, title, category, amount, date, is_recurring, icon)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    transaction.id,
    transaction.title,
    transaction.category,
    transaction.amount,
    transaction.date,
    transaction.isRecurring ? 1 : 0,
    transaction.icon,
  )

  res.status(201).json(transaction)
})

app.patch('/api/transactions/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM transactions WHERE id = ?')
    .get(req.params.id)
  if (!existing) {
    res.status(404).json({ error: 'Transaction not found' })
    return
  }

  const updated = { ...rowToTransaction(existing), ...req.body, id: existing.id }

  db.prepare(
    `UPDATE transactions
     SET title = ?, category = ?, amount = ?, date = ?, is_recurring = ?, icon = ?
     WHERE id = ?`,
  ).run(
    updated.title,
    updated.category,
    updated.amount,
    updated.date,
    updated.isRecurring ? 1 : 0,
    updated.icon,
    updated.id,
  )

  res.json(updated)
})

app.delete('/api/transactions/:id', (req, res) => {
  if (!deleteById('transactions', req.params.id)) {
    res.status(404).json({ error: 'Transaction not found' })
    return
  }
  res.json({ id: req.params.id })
})

// Derived from `transactions` (grouped by month) rather than stored, so the
// chart updates the moment a transaction is added, edited, or deleted.
app.get('/api/monthly-expenses', (req, res) => {
  const now = new Date()
  const year = now.getFullYear()
  const currentMonthIndex = now.getMonth()

  const rows = db
    .prepare(
      `SELECT substr(date, 1, 7) AS month_key, SUM(amount) AS total
       FROM transactions
       WHERE substr(date, 1, 4) = ?
       GROUP BY month_key`,
    )
    .all(String(year))
  const totalByMonthKey = new Map(rows.map((row) => [row.month_key, row.total]))

  const months = monthAbbreviations
    .slice(0, currentMonthIndex + 1)
    .map((abbreviation, index) => {
      const monthKey = `${year}-${String(index + 1).padStart(2, '0')}`
      return {
        id: abbreviation,
        label: abbreviation[0].toUpperCase() + abbreviation.slice(1),
        fullLabel: monthNames[index],
        value: round2(totalByMonthKey.get(monthKey) ?? 0),
      }
    })

  res.json(months)
})

// Total, categories, and the month-over-month change are all derived from the
// current month's transactions, so they stay in sync automatically.
app.get('/api/summary', (req, res) => {
  const currentMonthKey = monthKeyOffset(0)
  const previousMonthKey = monthKeyOffset(-1)

  const currentMonthTransactions = db
    .prepare('SELECT * FROM transactions WHERE substr(date, 1, 7) = ?')
    .all(currentMonthKey)
    .map(rowToTransaction)

  const { total: previousMonthTotal } = db
    .prepare(
      `SELECT COALESCE(SUM(amount), 0) AS total FROM transactions
       WHERE substr(date, 1, 7) = ?`,
    )
    .get(previousMonthKey)

  const total = round2(
    currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0),
  )

  const totalByCategory = new Map()
  for (const transaction of currentMonthTransactions) {
    totalByCategory.set(
      transaction.category,
      (totalByCategory.get(transaction.category) ?? 0) + transaction.amount,
    )
  }

  const categories = [...totalByCategory.entries()]
    .map(([label, value]) => ({
      id: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      value: round2(value),
      colorway: colorForCategory(label),
    }))
    .sort((a, b) => b.value - a.value)

  let changePercent = 0
  if (previousMonthTotal > 0) {
    changePercent = round2(((total - previousMonthTotal) / previousMonthTotal) * 100)
  } else if (total > 0) {
    changePercent = 100
  }

  res.json({ total, changePercent, categories })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`FinanceApp API listening on http://localhost:${PORT}`)
})
