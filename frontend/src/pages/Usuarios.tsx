import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { usuariosApi } from '../api/usuarios'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/Table'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import type { UsuarioRequest, UsuarioResponse, Cargo } from '../api/types'

const cargoLabels: Record<Cargo, string> = {
  CIDADAO: 'Cidadão',
  FUNCIONARIO_PUBLICO: 'Funcionário Público',
}

const empty: UsuarioRequest = { nome: '', documento: '', cargo: 'CIDADAO' }

export function Usuarios() {
  const queryClient = useQueryClient()
  const [editando, setEditando] = useState<UsuarioResponse | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<UsuarioRequest>(empty)

  const { data = [], isLoading } = useQuery({ queryKey: ['usuarios'], queryFn: usuariosApi.listar })

  const criar = useMutation({
    mutationFn: usuariosApi.criar,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); closeForm() },
  })

  const atualizar = useMutation({
    mutationFn: ({ id, body }: { id: number; body: UsuarioRequest }) => usuariosApi.atualizar(id, body),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['usuarios'] }); closeForm() },
  })

  const deletar = useMutation({
    mutationFn: usuariosApi.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['usuarios'] }),
  })

  const closeForm = () => { setShowForm(false); setEditando(null); setForm(empty) }

  const openEdit = (u: UsuarioResponse) => {
    setEditando(u)
    setForm({ nome: u.nome, documento: u.documento, cargo: u.cargo })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editando) {
      atualizar.mutate({ id: editando.id, body: form })
    } else {
      criar.mutate(form)
    }
  }

  const isPending = criar.isPending || atualizar.isPending
  const mutationError = criar.error || atualizar.error

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Cidadãos e funcionários públicos"
        action={
          <Button onClick={() => { closeForm(); setShowForm(true) }}>
            <Plus size={14} /> Novo Usuário
          </Button>
        }
      />
      <div className="p-8 space-y-4">
        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editando ? 'Editar Usuário' : 'Novo Usuário'}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                <Field label="Nome">
                  <input required value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className={inputClass} placeholder="Nome completo" />
                </Field>
                <Field label="Documento (CPF)">
                  <input required value={form.documento} onChange={e => setForm(f => ({ ...f, documento: e.target.value }))} className={inputClass} placeholder="00000000000" maxLength={11} />
                </Field>
                <Field label="Cargo">
                  <select value={form.cargo} onChange={e => setForm(f => ({ ...f, cargo: e.target.value as Cargo }))} className={inputClass}>
                    <option value="CIDADAO">Cidadão</option>
                    <option value="FUNCIONARIO_PUBLICO">Funcionário Público</option>
                  </select>
                </Field>
                {mutationError && <p className="text-xs text-red-500">{(mutationError as Error).message}</p>}
                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={isPending}>{isPending ? 'Salvando...' : editando ? 'Salvar' : 'Criar'}</Button>
                  <Button type="button" variant="secondary" onClick={closeForm}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          {isLoading ? (
            <div className="px-6 py-8 text-sm text-slate-500">Carregando...</div>
          ) : (
            <Table>
              <Thead>
                <tr>
                  <Th>Nome</Th>
                  <Th>Documento</Th>
                  <Th>Cargo</Th>
                  <Th>Desde</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {data.map(u => (
                  <Tr key={u.id}>
                    <Td className="font-medium text-slate-900">{u.nome}</Td>
                    <Td className="font-mono text-xs">{u.documento}</Td>
                    <Td>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${u.cargo === 'FUNCIONARIO_PUBLICO' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                        {cargoLabels[u.cargo]}
                      </span>
                    </Td>
                    <Td className="text-xs text-slate-500">{new Date(u.criadoEm).toLocaleDateString('pt-BR')}</Td>
                    <Td>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(u)}>
                          <Pencil size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { if (confirm('Deletar este usuário?')) deletar.mutate(u.id) }}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
                {data.length === 0 && (
                  <Tr><Td colSpan={5} className="text-center text-slate-400 py-8">Nenhum usuário cadastrado.</Td></Tr>
                )}
              </Tbody>
            </Table>
          )}
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
