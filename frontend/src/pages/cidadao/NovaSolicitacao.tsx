import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CheckCircle } from 'lucide-react'
import { solicitacoesApi } from '../../api/solicitacoes'
import { categoriasApi } from '../../api/categorias'
import { usuariosApi } from '../../api/usuarios'
import { useAuth } from '../../context/AuthContext'
import { PageHeader } from '../../components/PageHeader'
import { Button } from '../../components/Button'
import { Card, CardContent } from '../../components/Card'
import type { Prioridade, TipoIdentificacao, SolicitacaoRequest, CategoriaResponse } from '../../api/types'

type Step = 'categoria' | 'prioridade' | 'identificacao' | 'descricao' | 'localizacao' | 'cidadao' | 'sucesso'

const prioridadeInfo: Record<Prioridade, { label: string; sla: string; impacto: string }> = {
  BAIXA: { label: 'Baixa', sla: '15 dias', impacto: 'Impacto localizado' },
  MEDIA: { label: 'Média', sla: '7 dias', impacto: 'Impacto moderado' },
  ALTA: { label: 'Alta', sla: '3 dias', impacto: 'Impacto relevante' },
  CRITICA: { label: 'Crítica', sla: '1 dia', impacto: 'Impacto social alto' },
}

const prioridadeBorder: Record<Prioridade, string> = {
  BAIXA: 'border-slate-300 hover:border-slate-400',
  MEDIA: 'border-yellow-300 hover:border-yellow-400',
  ALTA: 'border-orange-300 hover:border-orange-400',
  CRITICA: 'border-red-400 hover:border-red-500',
}

const prioridadeSelected: Record<Prioridade, string> = {
  BAIXA: 'border-slate-600 bg-slate-50',
  MEDIA: 'border-yellow-500 bg-yellow-50',
  ALTA: 'border-orange-500 bg-orange-50',
  CRITICA: 'border-red-500 bg-red-50',
}

export function NovaSolicitacao() {
  const queryClient = useQueryClient()

  const [step, setStep] = useState<Step>('categoria')
  const [form, setForm] = useState<Partial<SolicitacaoRequest>>({})
  const [descricao, setDescricao] = useState('')
  const [localizacao, setLocalizacao] = useState('')
  const [cidadaoId, setCidadaoId] = useState<number | null>(null)
  const [protocolo, setProtocolo] = useState('')
  const [prazoAlvo, setPrazoAlvo] = useState('')
  const [descricaoError, setDescricaoError] = useState('')
  const [localizacaoError, setLocalizacaoError] = useState('')

  const { user } = useAuth()
  const isLoggedAsCidadao = user?.cargo === 'CIDADAO'

  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: categoriasApi.listar })
  const { data: usuarios = [] } = useQuery({
    queryKey: ['usuarios'],
    queryFn: usuariosApi.listar,
    enabled: !isLoggedAsCidadao,
  })
  const cidadaos = usuarios.filter(u => u.cargo === 'CIDADAO')

  const criar = useMutation({
    mutationFn: solicitacoesApi.criar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })
      setProtocolo(data.protocolo)
      setPrazoAlvo(data.prazoAlvo)
      setStep('sucesso')
    },
  })

  const isAnonimo = form.tipoIdentificacao === 'ANONIMO'

  const handleDescricaoNext = () => {
    const min = isAnonimo ? 20 : 10
    if (descricao.trim().length < min) {
      setDescricaoError(`Descrição deve ter no mínimo ${min} caracteres${isAnonimo ? ' (solicitação anônima)' : ''}.`)
      return
    }
    setDescricaoError('')
    setForm(f => ({ ...f, descricao: descricao.trim() }))
    setStep('localizacao')
  }

  const handleLocalizacaoNext = () => {
    if (isAnonimo && localizacao.trim().length < 3) {
      setLocalizacaoError('Localização deve ter no mínimo 3 caracteres para solicitação anônima.')
      return
    }
    if (!localizacao.trim()) {
      setLocalizacaoError('Localização é obrigatória.')
      return
    }
    setLocalizacaoError('')
    setForm(f => ({ ...f, localizacao: localizacao.trim() }))
    if (isAnonimo) {
      submitForm({ ...form, descricao: descricao.trim(), localizacao: localizacao.trim() })
    } else if (isLoggedAsCidadao && user) {
      // cidadão logado — auto-preenche e envia direto
      submitForm({ ...form, descricao: descricao.trim(), localizacao: localizacao.trim(), cidadaoId: user.id })
    } else {
      setStep('cidadao')
    }
  }

  const submitForm = (finalForm: Partial<SolicitacaoRequest>) => {
    criar.mutate({
      categoriaId: finalForm.categoriaId!,
      descricao: finalForm.descricao!,
      localizacao: finalForm.localizacao!,
      tipoIdentificacao: finalForm.tipoIdentificacao!,
      prioridade: finalForm.prioridade!,
      cidadaoId: finalForm.cidadaoId ?? undefined,
    })
  }

  const handleCidadaoNext = () => {
    if (!cidadaoId) return
    submitForm({ ...form, descricao: descricao.trim(), localizacao: localizacao.trim(), cidadaoId })
  }

  const resetForm = () => {
    setStep('categoria')
    setForm({})
    setDescricao('')
    setLocalizacao('')
    setCidadaoId(null)
    setProtocolo('')
    setPrazoAlvo('')
    setDescricaoError('')
    setLocalizacaoError('')
  }

  const stepLabels: Partial<Record<Step, string>> = {
    categoria: 'Categoria',
    prioridade: 'Prioridade',
    identificacao: 'Identificação',
    descricao: 'Descrição',
    localizacao: 'Localização',
    cidadao: 'Dados do Cidadão',
  }

  const stepOrder: Step[] = ['categoria', 'prioridade', 'identificacao', 'descricao', 'localizacao', 'cidadao']
  const currentIndex = stepOrder.indexOf(step)

  return (
    <div>
      <PageHeader title="Nova Solicitação" description="Registre um problema urbano na sua cidade" />
      <div className="p-8 max-w-2xl">

        {step !== 'sucesso' && currentIndex >= 0 && (
          <div className="flex items-center gap-2 mb-6">
            {stepOrder.slice(0, isAnonimo ? 5 : 6).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-medium
                  ${i < currentIndex ? 'bg-green-500 text-white' : i === currentIndex ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i < currentIndex ? '✓' : i + 1}
                </div>
                {i < (isAnonimo ? 4 : 5) && <div className={`h-px w-6 ${i < currentIndex ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
            <span className="ml-2 text-xs text-slate-500">{stepLabels[step]}</span>
          </div>
        )}

        <Card>
          <CardContent>

            {/* STEP 1: Categoria */}
            {step === 'categoria' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800">Selecione a categoria</h2>
                <div className="space-y-2">
                  {categorias.map((c: CategoriaResponse) => (
                    <button
                      key={c.id}
                      onClick={() => { setForm(f => ({ ...f, categoriaId: c.id })); setStep('prioridade') }}
                      className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all text-sm"
                    >
                      <span className="font-medium text-slate-800">{c.tipoCategoria}</span>
                      <span className="text-slate-500 ml-2">— {c.descricao}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Prioridade */}
            {step === 'prioridade' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800">Selecione a prioridade</h2>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(prioridadeInfo) as Prioridade[]).map((p) => {
                    const info = prioridadeInfo[p]
                    const isSelected = form.prioridade === p
                    return (
                      <button
                        key={p}
                        onClick={() => { setForm(f => ({ ...f, prioridade: p })); setStep('identificacao') }}
                        className={`text-left p-4 rounded-lg border-2 transition-all ${isSelected ? prioridadeSelected[p] : prioridadeBorder[p] + ' bg-white'}`}
                      >
                        <p className="font-semibold text-slate-900 text-sm">{info.label}</p>
                        <p className="text-xs text-slate-500 mt-0.5">SLA: {info.sla}</p>
                        <p className="text-xs text-slate-400">{info.impacto}</p>
                      </button>
                    )
                  })}
                </div>
                <button onClick={() => setStep('categoria')} className="text-xs text-slate-400 hover:text-slate-600">← Voltar</button>
              </div>
            )}

            {/* STEP 3: Identificação */}
            {step === 'identificacao' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-slate-800">Como deseja se identificar?</h2>
                <div className="space-y-3">
                  <button
                    onClick={() => { setForm(f => ({ ...f, tipoIdentificacao: 'ANONIMO' })); setStep('descricao') }}
                    className="w-full text-left px-4 py-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <p className="font-medium text-slate-800 text-sm">Anônimo</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sem identificação pessoal. Descrição mínima de 20 caracteres.</p>
                  </button>
                  <button
                    onClick={() => { setForm(f => ({ ...f, tipoIdentificacao: 'IDENTIFICADO' })); setStep('descricao') }}
                    className="w-full text-left px-4 py-4 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all"
                  >
                    <p className="font-medium text-slate-800 text-sm">Identificado</p>
                    <p className="text-xs text-slate-500 mt-0.5">Seus dados serão vinculados à solicitação.</p>
                  </button>
                </div>
                <button onClick={() => setStep('prioridade')} className="text-xs text-slate-400 hover:text-slate-600">← Voltar</button>
              </div>
            )}

            {/* STEP 4: Descrição */}
            {step === 'descricao' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-slate-800">Descreva o problema</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Mínimo {isAnonimo ? '20' : '10'} caracteres
                    {isAnonimo && <span className="ml-1 text-amber-600">(solicitação anônima exige mais detalhes)</span>}
                  </p>
                </div>
                <textarea
                  rows={5}
                  value={descricao}
                  onChange={e => { setDescricao(e.target.value); setDescricaoError('') }}
                  placeholder="Descreva o problema com o máximo de detalhes possível..."
                  className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{descricao.trim().length} caracteres</span>
                </div>
                {descricaoError && <p className="text-xs text-red-500">{descricaoError}</p>}
                <div className="flex gap-3">
                  <Button onClick={handleDescricaoNext}>Continuar</Button>
                  <button onClick={() => setStep('identificacao')} className="text-xs text-slate-400 hover:text-slate-600 self-center">← Voltar</button>
                </div>
              </div>
            )}

            {/* STEP 5: Localização */}
            {step === 'localizacao' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-slate-800">Localização / Bairro</h2>
                  <p className="text-xs text-slate-500 mt-1">Onde o problema está localizado?</p>
                </div>
                <input
                  value={localizacao}
                  onChange={e => { setLocalizacao(e.target.value); setLocalizacaoError('') }}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-300"
                />
                {localizacaoError && <p className="text-xs text-red-500">{localizacaoError}</p>}
                {criar.error && <p className="text-xs text-red-500">{(criar.error as Error).message}</p>}
                <div className="flex gap-3">
                  <Button onClick={handleLocalizacaoNext} disabled={criar.isPending}>
                    {criar.isPending ? 'Enviando...' : isAnonimo ? 'Enviar Solicitação' : 'Continuar'}
                  </Button>
                  <button onClick={() => setStep('descricao')} className="text-xs text-slate-400 hover:text-slate-600 self-center">← Voltar</button>
                </div>
              </div>
            )}

            {/* STEP 6: Cidadão (apenas se identificado) */}
            {step === 'cidadao' && (
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold text-slate-800">Selecione o cidadão</h2>
                  <p className="text-xs text-slate-500 mt-1">Vincule sua conta à solicitação</p>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cidadaos.length === 0 && (
                    <p className="text-sm text-slate-400">Nenhum cidadão cadastrado.</p>
                  )}
                  {cidadaos.map(u => (
                    <button
                      key={u.id}
                      onClick={() => setCidadaoId(u.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all text-sm
                        ${cidadaoId === u.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-slate-400'}`}
                    >
                      <p className="font-medium text-slate-800">{u.nome}</p>
                      <p className="text-xs text-slate-500 font-mono">{u.documento}</p>
                    </button>
                  ))}
                </div>
                {criar.error && <p className="text-xs text-red-500">{(criar.error as Error).message}</p>}
                <div className="flex gap-3">
                  <Button onClick={handleCidadaoNext} disabled={!cidadaoId || criar.isPending}>
                    {criar.isPending ? 'Enviando...' : 'Enviar Solicitação'}
                  </Button>
                  <button onClick={() => setStep('localizacao')} className="text-xs text-slate-400 hover:text-slate-600 self-center">← Voltar</button>
                </div>
              </div>
            )}

            {/* SUCESSO */}
            {step === 'sucesso' && (
              <div className="text-center py-6 space-y-4">
                <CheckCircle size={48} className="text-green-500 mx-auto" />
                <div>
                  <h2 className="font-semibold text-slate-800 text-lg">Solicitação registrada!</h2>
                  <p className="text-sm text-slate-500 mt-1">Guarde o protocolo para acompanhar sua solicitação</p>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-6 py-4 inline-block">
                  <p className="text-xs text-slate-400 mb-1">Protocolo</p>
                  <p className="font-mono font-bold text-slate-900 text-lg">{protocolo}</p>
                  <p className="text-xs text-slate-500 mt-2">Prazo alvo: <span className="font-medium">{prazoAlvo}</span></p>
                </div>
                <div className="flex gap-3 justify-center pt-2">
                  <Button onClick={resetForm} variant="primary">Nova Solicitação</Button>
                  <Button variant="secondary" onClick={() => window.location.href = '/cidadao/acompanhar'}>
                    Acompanhar
                  </Button>
                </div>
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
