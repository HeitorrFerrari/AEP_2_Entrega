import clsx from 'clsx'
import type { ReactNode } from 'react'

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('bg-white rounded-lg border border-slate-200 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4 border-b border-slate-100', className)}>{children}</div>
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <h2 className="text-base font-semibold text-slate-900">{children}</h2>
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx('px-6 py-4', className)}>{children}</div>
}
