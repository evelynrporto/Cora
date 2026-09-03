# Cora

Dashboard pessoal de finanças: cartões, lançamentos, gastos por mês e resumo por categoria.

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js (Express) + SQLite (via `node:sqlite`, nativo do Node — sem dependências de compilação)

## Pré-requisitos

- [Node.js](https://nodejs.org/) **22.5.0 ou superior** (o backend usa o módulo nativo `node:sqlite`, disponível a partir dessa versão)

## Como rodar

1. Clone o repositório e entre na pasta:

   ```bash
   git clone https://github.com/evelynrporto/Cora.git
   cd Cora
   ```

2. Instale as dependências do frontend (raiz) e do backend (`server/`):

   ```bash
   npm install
   npm install --prefix server
   ```

3. Suba frontend e backend juntos:

   ```bash
   npm run dev:all
   ```

   Isso inicia:
   - o frontend em [http://localhost:5173](http://localhost:5173)
   - a API em `http://localhost:3001`

4. Abra [http://localhost:5173](http://localhost:5173) no navegador.

Na primeira execução o backend cria automaticamente o banco SQLite em `server/data/financeapp.db`, já vazio (sem dados de exemplo) — é só começar a cadastrar cartões e lançamentos pela interface.

### Rodando frontend e backend separadamente

Se preferir dois terminais em vez do `dev:all`:

```bash
npm run dev            # frontend (Vite)
npm run dev:server     # backend (Express + SQLite)
```

## Build de produção (frontend)

```bash
npm run build
npm run preview
```

O backend em produção roda com `npm start --prefix server` (usa o mesmo `server/data/financeapp.db`).

## Estrutura do projeto

```
src/            frontend (componentes, widgets, libs)
server/         backend Express + SQLite
server/data/    banco SQLite local (gerado automaticamente, ignorado pelo git)
```

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia só o frontend |
| `npm run dev:server` | Inicia só o backend |
| `npm run dev:all` | Inicia frontend + backend juntos |
| `npm run build` | Type-check + build de produção do frontend |
| `npm run lint` | Roda o linter (Oxlint) |
| `npm run preview` | Serve o build de produção localmente |
