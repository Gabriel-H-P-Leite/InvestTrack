import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('card-surface p-4 md:p-5', className)} {...rest}>
      {children}
    </div>
  )
}

export function DemoBadge() {
  return (
    <span className="demo-badge">
      <svg fill="currentColor" height="8" viewBox="0 0 8 8" width="8">
        <circle cx="4" cy="4" r="4"></circle>
      </svg>
      Modo Demonstração
    </span>
  )
}

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'profit' | 'loss' | 'warning' | 'neutral'
}

export function Badge({ variant = 'default', className, children, ...rest }: BadgeProps) {
  const styles: Record<string, string> = {
    default: 'bg-secondary text-secondary-foreground',
    profit: 'bg-profit/15 text-profit',
    loss: 'bg-loss/15 text-loss',
    warning: 'bg-warning/15 text-warning',
    neutral: 'bg-muted text-muted-foreground',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        styles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'outline'
  size?: 'sm' | 'md'
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className,
  children,
  ...rest
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'gradient-primary text-white hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive:
      'bg-[hsl(0_72%_51%_/_0.15)] border border-[hsl(0_72%_51%_/_0.4)] text-[hsl(0_72%_60%)] hover:bg-[hsl(0_72%_51%_/_0.25)]',
    ghost: 'text-muted-foreground hover:text-foreground hover:bg-secondary',
    outline: 'border border-border text-foreground hover:bg-secondary',
  }
  const sizes: Record<string, string> = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
  }
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-secondary', className)}>
      <div
        className="h-full rounded-full gradient-primary transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export function StatCard({
  label,
  value,
  sub,
  icon,
  valueClassName,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
  valueClassName?: string
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className={cn('mt-1 text-lg font-bold text-foreground truncate', valueClassName)}>{value}</p>
          {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
        </div>
        {icon && (
          <div className="flex-shrink-0 rounded-lg bg-secondary p-2 text-primary">{icon}</div>
        )}
      </div>
    </Card>
  )
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2 mb-3">
      <h2 className="text-sm font-bold text-foreground">{children}</h2>
      {action}
    </div>
  )
}

export function EmptyState({ icon, title, description }: { icon?: ReactNode; title: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {description && <p className="text-xs text-muted-foreground max-w-xs">{description}</p>}
    </div>
  )
}
