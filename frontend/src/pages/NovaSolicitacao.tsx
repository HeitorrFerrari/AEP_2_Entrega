import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { solicitacoesApi } from '../api/solicitacoes'
import { categoriasApi } from '../api/categorias'
import { usuariosApi } from '../api/usuarios'
import { PageHeader } from '../components/PageHeader'
import { Card, CardContent } from '../components/Card'
import { Button } from '../components/Button'
import type { Prioridade, TipoIdentificacao, SolicitacaoRequest } from '../api/types'

export function NovaSolicitacao() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [form, setForm] = useState<Partial<SolicitacaoRequest>>({
    tipoIdentificacao: 'ANONIMO',
    prioridade: 'MEDIA',
  })

  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: categoriasApi.listar })
  const { data: usuarios = [] } = useQuery({ queryKey: ['usuarios'], queryFn: usuariosApi.listar })
  const cidadaos = usuarios.filter(u => u.cargo === 'CIDADAO')

  const criar = useMutation({
    mutationFn: solicitacoesApi.criar,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['solicitacoes'] })
      navigate(`/solicitacoes/${data.id}`)
    },
  })

  const set = (field: keyof SolicitacaoRequest, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoriaId || !form.descricao || !form.localizacao || !form.tipoIdentificacao || !form.prioridade) return
    criar.mutate(form as SolicitacaoRequest)
  }

  return (
    <div>
      <PageHeader
        title="Nova Solicitação"
        action={
          <Button variant="secondary" onClick={() => navigate('/solicitacoes')}>
            <ArrowLeft size={14} /> Voltar
          </Button>
        }
      />
      <div className="p-8 max-w-2xl">
        <Card>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Categoria">
                <select
                  required
                  value={form.categoriaId ?? ''}
                  onChange={e => set('categoriaId', Number(e.target.value))}
                  className={inputClass}
                >
                  <option value="">Selecionar...</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.tipoCategoria} — {c.descricao}</option>
                  ))}
                </select>
              </Field>

              <Field label="Tipo de Identificação">
                <select
                  value={form.tipoIdentificacao}
                  onChange={e => set('tipoIdentificacao', e.target.value as TipoIdentificacao)}
                  className={inputClass}
                >
                  <option value="ANONIMO">Anônimo</option>
                  <option value="IDENTIFICADO">Identificado</option>
                </select>
              </Field>

              {form.tipoIdentificacao === 'IDENTIFICADO' && (
                <Field label="Cidadão">
                  <select
                    required
                    value={form.cidadaoId ?? ''}
                    onChange={e => set('cidadaoId', Number(e.target.value))}
                    className={inputClass}
                  >
                    <option value="">Selecionar cidadão...</option>
                    {cidadaos.map(u => (
                      <option key={u.id} value={u.id}>{u.nome}</option>
                    ))}
                  </select>
                </Field>
              )}

              <Field label="Prioridade">
                <select
                  value={form.prioridade}
                  onChange={e => set('prioridade', e.target.value as Prioridade)}
                  className={inputClass}
                >
                  <option value="BAIXA">Baixa</option>
                  <option value="MEDIA">Média</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </Field>

              <Field label="Localização">
                <input
                  required
                  value={form.localizacao ?? ''}
                  onChange={e => set('localizacao', e.target.value)}
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  className={inputClass}
                />
              </Field>

              <Field label="Descrição">
                <textarea
                  required
                  rows={4}
                  value={form.descricao ?? ''}
                  onChange={e => set('descricao', e.target.value)}
                  placeholder="Descreva o problema com detalhes..."
                  className={`${inputClass} resize-none`}
                />
              </Field>

              {criar.error && (
                <p className="text-sm text-red-500">{(criar.error as Error).message}</p>
              )}

              <div className="pt-2">
                <Button type="submit" disabled={criar.isPending}>
                  {criar.isPending ? 'Criando...' : 'Criar Solicitação'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const inputClass = 'w-full text-sm border border-slate-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-slate-300'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
