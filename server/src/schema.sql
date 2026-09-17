create extension if not exists pgcrypto;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null unique,
  senha_hash text not null,
  perfil_risco text not null default 'Moderado',
  moeda text not null default 'BRL — Real Brasileiro',
  idioma text not null default 'Português (Brasil)',
  tema text not null default 'Escuro',
  criado_em timestamptz not null default now()
);

create table if not exists contas_financeiras (
  user_id uuid primary key references users(id) on delete cascade,
  saldo numeric(16, 2) not null default 0,
  total_entradas numeric(16, 2) not null default 0,
  total_saidas numeric(16, 2) not null default 0,
  transferido_para_carteira numeric(16, 2) not null default 0,
  resgatado numeric(16, 2) not null default 0
);

create table if not exists ativos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  ticker text not null,
  nome text not null,
  categoria text not null,
  setor text not null,
  quantidade numeric(20, 8) not null default 0,
  preco_medio numeric(16, 2) not null default 0,
  preco_atual numeric(16, 2) not null default 0,
  criado_em timestamptz not null default now()
);
create index if not exists ativos_user_idx on ativos (user_id);

create table if not exists transacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  ativo_id uuid references ativos(id) on delete set null,
  ticker text not null,
  tipo text not null,
  quantidade numeric(20, 8) not null,
  preco_unitario numeric(16, 2) not null,
  taxas numeric(16, 2) not null default 0,
  data date not null
);
create index if not exists transacoes_user_idx on transacoes (user_id, data desc);

create table if not exists movimentacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  titulo text not null,
  tipo text not null,
  metodo text,
  data date not null,
  valor numeric(16, 2) not null,
  status text not null default 'Concluído',
  criado_em timestamptz not null default now()
);
create index if not exists movimentacoes_user_idx on movimentacoes (user_id, data desc, criado_em desc);

create table if not exists proventos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  ticker text not null,
  tipo text not null,
  data date not null,
  valor numeric(16, 2) not null,
  yield_pct numeric(8, 2) not null default 0
);
create index if not exists proventos_user_idx on proventos (user_id, data desc);

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  emoji text not null default '🎯',
  titulo text not null,
  descricao text not null default '',
  valor_atual numeric(16, 2) not null default 0,
  valor_alvo numeric(16, 2) not null,
  prazo date not null,
  vinculo_automatico text,
  criado_em timestamptz not null default now()
);
create index if not exists metas_user_idx on metas (user_id);

create table if not exists notificacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  icone text not null default 'carteira',
  titulo text not null,
  mensagem text not null,
  data timestamptz not null default now(),
  lida boolean not null default false
);
create index if not exists notificacoes_user_idx on notificacoes (user_id, data desc);

create table if not exists aulas_concluidas (
  user_id uuid not null references users(id) on delete cascade,
  aula_id text not null,
  concluida_em timestamptz not null default now(),
  primary key (user_id, aula_id)
);
