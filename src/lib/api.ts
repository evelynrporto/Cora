import type { CardData } from '../components/CardsWidget'
import type { MonthlyExpense } from '../components/ExpensesChartWidget'
import type { CategorySpending } from '../components/SummaryWidget'
import type { TransactionData } from '../components/TransactionsWidget'

const API_BASE_URL = 'http://localhost:3001/api'

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`API error ${response.status} on ${path}`)
  }

  return response.json()
}

export interface SummaryResponse {
  total: number
  changePercent: number
  categories: CategorySpending[]
}

export function fetchCards(): Promise<CardData[]> {
  return apiFetch('/cards')
}

export function createCard(card: Omit<CardData, 'id'>): Promise<CardData> {
  return apiFetch('/cards', {
    method: 'POST',
    body: JSON.stringify(card),
  })
}

export function updateCard(card: CardData): Promise<CardData> {
  return apiFetch(`/cards/${card.id}`, {
    method: 'PATCH',
    body: JSON.stringify(card),
  })
}

export function deleteCard(id: string): Promise<{ id: string }> {
  return apiFetch(`/cards/${id}`, { method: 'DELETE' })
}

export function fetchTransactions(): Promise<TransactionData[]> {
  return apiFetch('/transactions')
}

export function createTransaction(
  transaction: Omit<TransactionData, 'id'>,
): Promise<TransactionData> {
  return apiFetch('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  })
}

export function updateTransaction(
  transaction: TransactionData,
): Promise<TransactionData> {
  return apiFetch(`/transactions/${transaction.id}`, {
    method: 'PATCH',
    body: JSON.stringify(transaction),
  })
}

export function deleteTransaction(id: string): Promise<{ id: string }> {
  return apiFetch(`/transactions/${id}`, { method: 'DELETE' })
}

export function fetchMonthlyExpenses(): Promise<MonthlyExpense[]> {
  return apiFetch('/monthly-expenses')
}

export function fetchSummary(): Promise<SummaryResponse> {
  return apiFetch('/summary')
}
