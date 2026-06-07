import type { ReactNode } from 'react'
import clsx from 'clsx'

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return <thead className="border-b border-slate-200">{children}</thead>
}

export function Th({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <th className={clsx('px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide', className)}>
      {children}
    </th>
  )
}

export function Tbody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>
}

export function Tr({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) {
  return (
    <tr
      onClick={onClick}
      className={clsx('hover:bg-slate-50 transition-colors', onClick && 'cursor-pointer', className)}
    >
      {children}
    </tr>
  )
}

export function Td({ children, className }: { children: ReactNode; className?: string }) {
  return <td className={clsx('px-4 py-3 text-slate-700', className)}>{children}</td>
}
