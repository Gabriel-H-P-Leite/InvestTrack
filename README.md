# INVESTTRACK

Plataforma de gestão de investimentos — **React + Vite + TypeScript + Tailwind** no front e **Node (Express) + PostgreSQL** no back, rodando com **[Bun](https://bun.sh)**.

Inclui cadastro/login com JWT, dados persistidos em banco (cada usuário tem os seus) e todas as telas funcionais: dashboard, conta financeira, carteira, transações, extrato, rentabilidade, proventos, análise, metas, academia, simuladores, notificações e perfil.

> ⚠️ Os dados de mercado são fictícios ("Modo Demonstração"). Não há integração com cotações reais.

## Rodando o projeto

Você precisa de **Bun** e de um **PostgreSQL** rodando.

### 1. Backend (`server/`)

```bash
cd server
cp .env.example .env     # ajuste DATABASE_URL e JWT_SECRET
bun install
bun run migrate          # cria as tabelas
bun run dev              # API em http://localhost:3333
```

Confira se subiu: `curl http://localhost:3333/api/health`

### 2. Frontend (raiz)

```bash
cp .env.example .env     # VITE_API_URL=http://localhost:3333/api
bun install
bun run dev              # app em http://localhost:5173
```

Crie uma conta na tela de login — ela já vem com dados de demonstração para explorar.

### Build de produção

```bash
bun run build   # front (gera dist/)
bun run preview
```

### Verificação de tipos

```bash
bun run lint            # front
cd server && bun run lint   # back
```

## Autenticação

- Senhas com hash **bcrypt**; sessão via **JWT** (`Authorization: Bearer <token>`).
- O token fica no `localStorage` e é revalidado em `/api/auth/me` ao abrir o app.
- Rotas protegidas no front por `ProtectedRoute`; no back, pelo middleware `requireAuth`.

## Endpoints principais

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/auth/register` | Cria conta (já semeia os dados demo) |
| POST | `/api/auth/login` | Autentica e devolve o token |
| GET | `/api/auth/me` | Dados do usuário logado |
| GET | `/api/state` | Estado completo do usuário |
| POST | `/api/conta/deposito` · `/saque` · `/transferir` · `/resgatar` | Operações da conta financeira |
| POST | `/api/ativos` · `/api/transacoes` | Carteira e operações |
| POST | `/api/metas` · `/api/metas/:id/aporte` | Metas |
| PATCH | `/api/notificacoes/:id/lida` | Marcar notificação como lida |
| POST | `/api/academia/aulas/:aulaId/toggle` | Concluir/desfazer aula |
| PATCH | `/api/perfil` | Atualizar perfil |
| POST | `/api/demo/restaurar` | Restaurar dados demonstrativos |

## Navegação

As páginas de ativos (**Carteira, Transações, Rentabilidade, Proventos e Análise**) foram
**removidas do menu lateral** porque ainda não possuem cotação em tempo real. Os arquivos e as
rotas continuam existindo — basta acessar por URL direta (ex.: `/carteira`) ou recolocar os itens
em `src/components/layout/Sidebar.tsx` quando houver integração com cotações.

## Estrutura do projeto

```
server/          API Node + Express + Postgres
  src/
    index.ts     Servidor e rotas
    db.ts        Pool de conexões
    schema.sql   Tabelas
    auth.ts      JWT + bcrypt + middleware
    state.ts     Carga do estado e seed de demonstração
    catalog.ts   Catálogo da Academia e dados iniciais
    routes/      auth.ts, dados.ts

src/
  components/
    layout/     Sidebar, header mobile, bottom nav, layout geral
    ui/         Botões, cards, badges, barra de progresso, modal
    charts/     Gráficos (recharts): área, barras, linhas, pizza
    forms/      Modais de ação (depositar, nova operação, nova meta...)
    shared/     Itens reutilizados entre páginas (linha de movimentação)
  context/
    AuthContext.tsx   Login, cadastro, sessão
    AppContext.tsx    Estado global vindo da API
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
