// Keep in sync with categoryOptions in
// src/components/TransactionsWidget/TransactionEditModal.tsx
const CATEGORY_COLORS = {
  Alimentação: 'green',
  Assinatura: 'purple',
  Transporte: 'blue',
  Beleza: 'yellow',
  Compras: 'purple',
  Lazer: 'blue',
  Saúde: 'green',
  Moradia: 'yellow',
  Outros: 'purple',
}

export function colorForCategory(name) {
  return CATEGORY_COLORS[name] ?? 'purple'
}
