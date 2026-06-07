import clsx from 'clsx'
import type { StatusSolicitacao, Prioridade } from '../api/types'

const statusStyles: Record<StatusSolicitacao, string> = {
  ABERTO: 'bg-blue-100 text-blue-700',
  TRIAGEM: 'bg-amber-100 text-amber-700',
  EM_EXECUCAO: 'bg-orange-100 text-orange-700',
  RESOLVIDO: 'bg-green-100 text-green-700',
  ENCERRADO: 'bg-slate-100 text-slate-600',
}

const statusLabels: Record<StatusSolicitacao, string> = {
  ABERTO: 'Aberto',
  TRIAGEM: 'Triagem',
  EM_EXECUCAO: 'Em Execução',
  RESOLVIDO: 'Resolvido',
  ENCERRADO: 'Encerrado',
}

const prioridadeStyles: Record<Prioridade, string> = {
  BAIXA: 'bg-slate-100 text-slate-600',
  MEDIA: 'bg-yellow-100 text-yellow-700',
  ALTA: 'bg-orange-100 text-orange-700',
  CRITICA: 'bg-red-100 text-red-700',
}

interface BadgeProps {
  className?: string
}

export function StatusBadge({ status }: { status: StatusSolicitacao } & BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', statusStyles[status])}>
      {statusLabels[status]}
    </span>
  )
}

export function PrioridadeBadge({ prioridade }: { prioridade: Prioridade } & BadgeProps) {
  return (
    <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium', prioridadeStyles[prioridade])}>
      {prioridade}
    </span>
  )
}
