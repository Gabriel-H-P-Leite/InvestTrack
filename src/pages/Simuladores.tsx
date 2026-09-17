import { useMemo, useState } from 'react'
import { TriangleAlert } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, Card, DemoBadge, SectionTitle, StatCard } from '@/components/ui/Primitives'
import { Field, inputClass } from '@/components/ui/Modal'
import { cn, formatBRL } from '@/lib/utils'

type Aba = 'juros' | 'aposentadoria' | 'renda'

const TABS: { id: Aba; label: string }[] = [
  { id: 'juros', label: 'Juros Compostos' },
  { id: 'aposentadoria', label: 'Aposentadoria' },
  { id: 'renda', label: 'Renda Passiva' },
]

const GRID_COLOR = 'hsl(222 47% 16%)'
const AXIS_COLOR = 'hsl(215 20% 55%)'
const PRIMARY = 'hsl(158 64% 40%)'

function SimChart({ data }: { data: { mes: number; total: number; investido: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="simGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="mes"
          tickFormatter={(v) => `${v}m`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222 47% 9%)',
            border: '1px solid hsl(222 47% 16%)',
            borderRadius: 8,
            fontSize: 12,
          }}
          formatter={(value: number, name: string) => [formatBRL(value), name === 'total' ? 'Montante' : 'Investido']}
          labelFormatter={(v) => `Mês ${v}`}
        />
        <Area type="monotone" dataKey="total" stroke={PRIMARY} strokeWidth={2} fill="url(#simGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function Simuladores() {
  const [aba, setAba] = useState<Aba>('juros')

  return (
    <>
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-bold text-foreground">Simuladores</h1>
          <DemoBadge />
        </div>
        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <TriangleAlert size={14} className="mt-0.5 flex-shrink-0 text-warning" />
          Os resultados são estimativas educacionais e não constituem garantia de rentabilidade ou recomendação de
          investimento.
        </p>
      </div>

      <div className="flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setAba(t.id)}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
              aba === t.id
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'text-muted-foreground border-border hover:bg-secondary'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {aba === 'juros' && <SimuladorJuros />}
      {aba === 'aposentadoria' && <SimuladorAposentadoria />}
      {aba === 'renda' && <SimuladorRendaPassiva />}
    </>
  )
}

function SimuladorJuros() {
  const [inicial, setInicial] = useState('5000')
  const [aporte, setAporte] = useState('500')
  const [taxa, setTaxa] = useState('0,8')
  const [meses, setMeses] = useState('120')
  const [resultado, setResultado] = useState<{ mes: number; total: number; investido: number }[] | null>(null)

  const simular = () => {
    const i = Number(inicial.replace(',', '.')) || 0
    const a = Number(aporte.replace(',', '.')) || 0
    const t = (Number(taxa.replace(',', '.')) || 0) / 100
    const n = Math.max(1, Math.round(Number(meses) || 0))

    const dados: { mes: number; total: number; investido: number }[] = []
    let total = i
    let investido = i
    dados.push({ mes: 0, total, investido })
    for (let m = 1; m <= n; m++) {
      total = total * (1 + t) + a
      investido += a
      if (m % Math.max(1, Math.round(n / 60)) === 0 || m === n) {
        dados.push({ mes: m, total, investido })
      }
    }
    setResultado(dados)
  }

  const final = resultado?.[resultado.length - 1]
  const jurosAcumulados = final ? final.total - final.investido : 0

  return (
    <Card>
      <SectionTitle>Simulador de Juros Compostos</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Investimento Inicial (R$)">
          <input className={inputClass} inputMode="decimal" value={inicial} onChange={(e) => setInicial(e.target.value)} />
        </Field>
        <Field label="Aporte Mensal (R$)">
          <input className={inputClass} inputMode="decimal" value={aporte} onChange={(e) => setAporte(e.target.value)} />
        </Field>
        <Field label="Taxa Mensal (%)">
          <input className={inputClass} inputMode="decimal" value={taxa} onChange={(e) => setTaxa(e.target.value)} />
        </Field>
        <Field label="Período (meses)">
          <input className={inputClass} inputMode="numeric" value={meses} onChange={(e) => setMeses(e.target.value)} />
        </Field>
      </div>
      <Button variant="primary" className="w-full sm:w-auto" onClick={simular}>
        Simular
      </Button>

      {resultado && final && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <StatCard label="Total Investido" value={formatBRL(final.investido)} />
            <StatCard label="Juros Acumulados" value={formatBRL(jurosAcumulados)} valueClassName="text-profit" />
            <StatCard label="Montante Final" value={formatBRL(final.total)} valueClassName="text-profit" />
          </div>
          <SimChart data={resultado} />
        </div>
      )}
    </Card>
  )
}

function SimuladorAposentadoria() {
  const [rendaDesejada, setRendaDesejada] = useState('5000')
  const [patrimonioAtual, setPatrimonioAtual] = useState('90000')
  const [aporteMensal, setAporteMensal] = useState('1500')
  const [taxa, setTaxa] = useState('0,7')
  const [resultado, setResultado] = useState<{
    patrimonioNecessario: number
    meses: number
    dados: { mes: number; total: number; investido: number }[]
  } | null>(null)

  const simular = () => {
    const renda = Number(rendaDesejada.replace(',', '.')) || 0
    const t = (Number(taxa.replace(',', '.')) || 0) / 100
    const patrimonioNecessario = t > 0 ? renda / t : 0
    let total = Number(patrimonioAtual.replace(',', '.')) || 0
    const a = Number(aporteMensal.replace(',', '.')) || 0
    let investido = total
    const dados: { mes: number; total: number; investido: number }[] = [{ mes: 0, total, investido }]
    let meses = 0
    const limite = 720 // 60 anos de segurança
    while (total < patrimonioNecessario && meses < limite) {
      total = total * (1 + t) + a
      investido += a
      meses++
      if (meses % 6 === 0 || total >= patrimonioNecessario) dados.push({ mes: meses, total, investido })
    }
    setResultado({ patrimonioNecessario, meses, dados })
  }

  return (
    <Card>
      <SectionTitle>Simulador de Aposentadoria</SectionTitle>
      <div className="grid sm:grid-cols-2 gap-x-4">
        <Field label="Renda Mensal Desejada (R$)">
          <input className={inputClass} inputMode="decimal" value={rendaDesejada} onChange={(e) => setRendaDesejada(e.target.value)} />
        </Field>
        <Field label="Patrimônio Atual (R$)">
          <input className={inputClass} inputMode="decimal" value={patrimonioAtual} onChange={(e) => setPatrimonioAtual(e.target.value)} />
        </Field>
        <Field label="Aporte Mensal (R$)">
          <input className={inputClass} inputMode="decimal" value={aporteMensal} onChange={(e) => setAporteMensal(e.target.value)} />
        </Field>
        <Field label="Rendimento Mensal Esperado (%)">
          <input className={inputClass} inputMode="decimal" value={taxa} onChange={(e) => setTaxa(e.target.value)} />
        </Field>
      </div>
      <Button variant="primary" className="w-full sm:w-auto" onClick={simular}>
        Simular
      </Button>

      {resultado && (
        <div className="mt-5 pt-5 border-t border-border space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <StatCard label="Patrimônio Necessário" value={formatBRL(resultado.patrimonioNecessario)} />
            <StatCard
              label="Tempo Estimado"
              value={
                resultado.meses >= 720
                  ? 'Mais de 60 anos'
                  : `${Math.floor(resultado.meses / 12)} anos e ${resultado.meses % 12} meses`
              }
            />
            <StatCard label="Renda Mensal na Meta" value={`${formatBRL(Number(rendaDesejada.replace(',', '.')) || 0)}/mês`} />
          </div>
          <SimChart data={resultado.dados} />
        </div>
      )}
    </Card>
  )
}

function SimuladorRendaPassiva() {
  const [rendaDesejada, setRendaDesejada] = useState('3000')
  const [yieldMensal, setYieldMensal] = useState('0,7')
  const [patrimonioAtual, setPatrimonioAtual] = useState('80500')

  const resultado = useMemo(() => {
    const renda = Number(rendaDesejada.replace(',', '.')) || 0
    const y = (Number(yieldMensal.replace(',', '.')) || 0) / 100
    const necessario = y > 0 ? renda / y : 0
    const atual = Number(patrimonioAtual.replace(',', '.')) || 0
    const progresso = necessario > 0 ? Math.min(100, (atual / necessario) * 100) : 0
    const rendaAtual = atual * y
    return { necessario, progresso, rendaAtual }
  }, [rendaDesejada, yieldMensal, patrimonioAtual])

  return (
    <Card>
      <SectionTitle>Simulador de Renda Passiva</SectionTitle>
      <div className="grid sm:grid-cols-3 gap-x-4">
        <Field label="Renda Mensal Desejada (R$)">
          <input className={inputClass} inputMode="decimal" value={rendaDesejada} onChange={(e) => setRendaDesejada(e.target.value)} />
        </Field>
        <Field label="Yield Mensal Médio (%)">
          <input className={inputClass} inputMode="decimal" value={yieldMensal} onChange={(e) => setYieldMensal(e.target.value)} />
        </Field>
        <Field label="Patrimônio Atual em Renda Passiva (R$)">
          <input className={inputClass} inputMode="decimal" value={patrimonioAtual} onChange={(e) => setPatrimonioAtual(e.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mt-4">
        <StatCard label="Patrimônio Necessário" value={formatBRL(resultado.necessario)} />
        <StatCard label="Renda Passiva Atual" value={`${formatBRL(resultado.rendaAtual)}/mês`} valueClassName="text-profit" />
        <StatCard label="Progresso da Meta" value={`${resultado.progresso.toFixed(1)}%`} />
      </div>
    </Card>
  )
}
