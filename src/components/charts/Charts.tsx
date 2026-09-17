import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatBRL, formatDateLong } from '@/lib/utils'

const GRID_COLOR = 'hsl(222 47% 16%)'
const AXIS_COLOR = 'hsl(215 20% 55%)'
const PRIMARY = 'hsl(158 64% 40%)'
const LOSS = 'hsl(0 72% 51%)'
const WARNING = 'hsl(38 92% 50%)'

const tooltipStyle = {
  backgroundColor: 'hsl(222 47% 9%)',
  border: '1px solid hsl(222 47% 16%)',
  borderRadius: 8,
  fontSize: 12,
  color: 'hsl(210 40% 96%)',
}

export function WealthAreaChart({ data }: { data: { data: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity={0.35} />
            <stop offset="100%" stopColor={PRIMARY} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="data"
          tickFormatter={formatDateLong}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
          minTickGap={30}
        />
        <YAxis
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => formatDateLong(String(v))}
          formatter={(value: number) => [formatBRL(value), 'Patrimônio']}
        />
        <Area type="monotone" dataKey="valor" stroke={PRIMARY} strokeWidth={2} fill="url(#wealthGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function CashFlowBarChart({ data }: { data: { mes: string; entradas: number; saidas: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatBRL(value)} />
        <Bar dataKey="entradas" name="Entradas" fill={PRIMARY} radius={[4, 4, 0, 0]} />
        <Bar dataKey="saidas" name="Saídas" fill={LOSS} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DividendsBarChart({ data }: { data: { mes: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis dataKey="mes" tick={{ fill: AXIS_COLOR, fontSize: 11 }} axisLine={{ stroke: GRID_COLOR }} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={36}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatBRL(value)} />
        <Bar dataKey="valor" name="Proventos" fill={PRIMARY} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ReturnsLineChart({
  data,
}: {
  data: { data: string; carteira: number; cdi: number; ibovespa: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} vertical={false} />
        <XAxis
          dataKey="data"
          tickFormatter={formatDateLong}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={{ stroke: GRID_COLOR }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${v.toFixed(1)}%`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(v) => formatDateLong(String(v))}
          formatter={(value: number) => `${value.toFixed(2)}%`}
        />
        <Line type="monotone" dataKey="carteira" name="Carteira" stroke={PRIMARY} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="cdi" name="CDI (est.)" stroke={WARNING} strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="ibovespa" name="Ibovespa (est.)" stroke={AXIS_COLOR} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

const PIE_COLORS = [
  'hsl(158 64% 40%)',
  'hsl(38 92% 50%)',
  'hsl(199 89% 48%)',
  'hsl(280 65% 60%)',
  'hsl(0 72% 51%)',
  'hsl(45 93% 58%)',
]

export function ClassPieChart({ data }: { data: { nome: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="valor" nameKey="nome" innerRadius={55} outerRadius={90} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatBRL(value)} />
      </PieChart>
    </ResponsiveContainer>
  )
}

export function SectorBarChart({ data }: { data: { setor: string; valor: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={GRID_COLOR} horizontal={false} />
        <XAxis
          type="number"
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="setor"
          tick={{ fill: AXIS_COLOR, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={130}
        />
        <Tooltip contentStyle={tooltipStyle} formatter={(value: number) => formatBRL(value)} />
        <Bar dataKey="valor" fill={PRIMARY} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
