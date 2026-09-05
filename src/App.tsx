import { useEffect, useState } from 'react'
import { FiCreditCard, FiHome, FiPieChart, FiRepeat, FiSettings, FiTarget } from 'react-icons/fi'
import { CardsWidget } from './components/CardsWidget'
import type { CardData } from './components/CardsWidget'
import { ThemeSwitcher } from './components/common/ThemeSwitcher'
import { ExpensesChartWidget } from './components/ExpensesChartWidget'
import type { MonthlyExpense } from './components/ExpensesChartWidget'
import { Sidebar } from './components/Sidebar'
import type { SidebarItem } from './components/Sidebar'
import { SummaryWidget } from './components/SummaryWidget'
import type { CategorySpending } from './components/SummaryWidget'
import { TransactionsWidget } from './components/TransactionsWidget'
import type { TransactionData } from './components/TransactionsWidget'
import {
  createCard,
  createTransaction,
  deleteCard,
  deleteTransaction,
  fetchCards,
  fetchMonthlyExpenses,
  fetchSummary,
  fetchTransactions,
  updateCard,
  updateTransaction,
} from './lib/api'
import { useTheme } from './theme/useTheme'
import './App.css'

interface AppData {
  cards: CardData[]
  transactions: TransactionData[]
  monthlyExpenses: MonthlyExpense[]
  total: number
  changePercent: number
  categories: CategorySpending[]
}

const navItems: SidebarItem[] = [
  { id: 'resumo', label: 'Resumo', icon: FiHome },
  { id: 'transacoes', label: 'Transações', icon: FiRepeat },
  { id: 'cartoes', label: 'Cartões', icon: FiCreditCard },
  { id: 'metas', label: 'Metas', icon: FiTarget },
  { id: 'relatorios', label: 'Relatórios', icon: FiPieChart },
  { id: 'configuracoes', label: 'Configurações', icon: FiSettings },
]

function App() {
  const [data, setData] = useState<AppData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeSection, setActiveSection] = useState(navItems[0].id)
  const { theme, setTheme } = useTheme()
  const activeItem = navItems.find((item) => item.id === activeSection)!

  useEffect(() => {
    Promise.all([
      fetchCards(),
      fetchTransactions(),
      fetchMonthlyExpenses(),
      fetchSummary(),
    ])
      .then(([cards, transactions, monthlyExpenses, summary]) => {
        setData({ cards, transactions, monthlyExpenses, ...summary })
      })
      .catch(() => {
        setError(
          'Não foi possível conectar ao servidor. Rode "npm run dev" na pasta server/ e recarregue a página.',
        )
      })
  }, [])

  // Category totals and the monthly chart are derived from transactions on
  // the server, so any create/edit needs to re-pull them to stay in sync.
  async function refreshDerivedData() {
    const [monthlyExpenses, summary] = await Promise.all([
      fetchMonthlyExpenses(),
      fetchSummary(),
    ])
    setData((current) =>
      current ? { ...current, monthlyExpenses, ...summary } : current,
    )
  }

  // Applies `updater` to `data[key]` right away, sends `request`, and rolls
  // the field back if the request fails — shared by every edit/delete action
  // below so each one only has to describe its own change and endpoint call.
  async function applyOptimisticUpdate<K extends keyof AppData>(
    key: K,
    updater: (value: AppData[K]) => AppData[K],
    request: () => Promise<unknown>,
    options: { errorMessage: string; onSuccess?: () => Promise<void> } = {
      errorMessage: 'Falha ao salvar as alterações:',
    },
  ) {
    const previousValue = data?.[key]
    setData((current) =>
      current ? { ...current, [key]: updater(current[key]) } : current,
    )

    try {
      await request()
      await options.onSuccess?.()
    } catch (requestError) {
      console.error(options.errorMessage, requestError)
      if (previousValue !== undefined) {
        setData((current) =>
          current ? { ...current, [key]: previousValue } : current,
        )
      }
    }
  }

  async function handleCreateCard(draft: Omit<CardData, 'id'>) {
    const created = await createCard(draft)
    setData((current) =>
      current ? { ...current, cards: [...current.cards, created] } : current,
    )
  }

  function handleUpdateCard(updated: CardData) {
    return applyOptimisticUpdate(
      'cards',
      (cards) => cards.map((card) => (card.id === updated.id ? updated : card)),
      () => updateCard(updated),
      { errorMessage: 'Falha ao salvar o cartão:' },
    )
  }

  function handleDeleteCard(id: string) {
    return applyOptimisticUpdate(
      'cards',
      (cards) => cards.filter((card) => card.id !== id),
      () => deleteCard(id),
      { errorMessage: 'Falha ao excluir o cartão:' },
    )
  }

  async function handleCreateTransaction(draft: Omit<TransactionData, 'id'>) {
    const created = await createTransaction(draft)
    setData((current) =>
      current
        ? { ...current, transactions: [created, ...current.transactions] }
        : current,
    )
    await refreshDerivedData()
  }

  function handleDeleteTransaction(id: string) {
    return applyOptimisticUpdate(
      'transactions',
      (transactions) => transactions.filter((transaction) => transaction.id !== id),
      () => deleteTransaction(id),
      { errorMessage: 'Falha ao excluir o gasto:', onSuccess: refreshDerivedData },
    )
  }

  function handleUpdateTransaction(updated: TransactionData) {
    return applyOptimisticUpdate(
      'transactions',
      (transactions) =>
        transactions.map((transaction) =>
          transaction.id === updated.id ? updated : transaction,
        ),
      () => updateTransaction(updated),
      { errorMessage: 'Falha ao salvar o gasto:', onSuccess: refreshDerivedData },
    )
  }

  function renderContent() {
    if (error) return <p className="errorMessage">{error}</p>
    if (!data) return <p className="loadingMessage">Carregando...</p>
    if (activeSection !== 'resumo') return <p className="comingSoon widgetCard">Em breve.</p>

    return (
      <>
        <div className="topRow">
          <SummaryWidget
            total={data.total}
            changePercent={data.changePercent}
            categories={data.categories}
          />
          <CardsWidget
            cards={data.cards}
            onCreateCard={handleCreateCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
          />
        </div>
        <div className="topRow">
          <TransactionsWidget
            transactions={data.transactions}
            onCreateTransaction={handleCreateTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            onDeleteTransaction={handleDeleteTransaction}
          />
          <ExpensesChartWidget data={data.monthlyExpenses} />
        </div>
      </>
    )
  }

  return (
    <div className="page">
      <Sidebar items={navItems} activeId={activeSection} onSelect={setActiveSection} />

      <div className="content">
        <div className="contentInner">
          <header className="appHeader">
            <h1 className="pageTitle">{activeItem.label}</h1>
            <ThemeSwitcher value={theme} onChange={setTheme} />
          </header>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default App
