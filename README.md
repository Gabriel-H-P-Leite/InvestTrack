# INVESTTRACK

Plataforma de gestão de investimentos — clone funcional construído com **Vite + React + TypeScript + Tailwind CSS**, feito para rodar com **[Bun](https://bun.sh)**.

Este projeto recria a interface e os fluxos do app original (dashboard, conta financeira, carteira, transações, extrato, rentabilidade, proventos, análise, metas, academia, simuladores, notificações e perfil), com **dados mockados e estado funcional de verdade**: depositar, sacar, transferir, comprar/vender ativos, criar metas, concluir aulas etc. realmente atualizam o estado da aplicação (persistido no `localStorage` do navegador).

> ⚠️ Todos os dados são fictícios ("Modo Demonstração"). Nada aqui se conecta a uma API real de investimentos.

## Rodando com Bun

Instale as dependências:

```bash
bun install
```

Suba o servidor de desenvolvimento:

```bash
bun run dev
```

Acesse `http://localhost:5173`.

### Build de produção

```bash
bun run build
bun run preview
```

O build final fica em `dist/`.

### Verificação de tipos

```bash
bun run lint
```

## Estrutura do projeto

```
src/
  components/
    layout/     Sidebar, header mobile, bottom nav, layout geral
    ui/         Botões, cards, badges, barra de progresso, modal
    charts/     Gráficos (recharts): área, barras, linhas, pizza
    forms/      Modais de ação (depositar, nova operação, nova meta...)
    shared/     Itens reutilizados entre páginas (linha de movimentação)
  context/
    AppContext.tsx    Estado global mockado (reducer + localStorage)
    ToastContext.tsx  Notificações "toast"
  lib/
    mockData.ts  Dados iniciais (seed) de todas as telas
    utils.ts     Formatação de moeda, data, %, etc.
  pages/         Uma página por rota
  App.tsx        Rotas (react-router-dom)
  main.tsx       Ponto de entrada
```

## Restaurar dados de demonstração

Na página **Perfil → Dados de Demonstração → Restaurar dados demonstrativos**, todo o estado volta ao ponto inicial (ou, manualmente, apague a chave `investtrack-demo-state-v1` do `localStorage`).

## Stack

- [Vite](https://vitejs.dev) 6
- [React](https://react.dev) 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com) 3
- [react-router-dom](https://reactrouter.com) 6
- [recharts](https://recharts.org) 2
- [lucide-react](https://lucide.dev) (ícones)
- [Bun](https://bun.sh) como runtime/gerenciador de pacotes
