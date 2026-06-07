import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2 } from 'lucide-react'
import { denunciasApi } from '../api/denuncias'
import { categoriasApi } from '../api/categorias'
import { usuariosApi } from '../api/usuarios'
import { PageHeader } from '../components/PageHeader'
import { Button } from '../components/Button'
import { Table, Thead, Th, Tbody, Tr, Td } from '../components/Table'
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card'
import type { TipoIdentificacao, DenunciaRequest } from '../api/types'

export function Denuncias() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Partial<DenunciaRequest>>({ tipoIdentificacao: 'ANONIMO' })

  const { data = [], isLoading } = useQuery({ queryKey: ['denuncias'], queryFn: denunciasApi.listar })
  const { data: categorias = [] } = useQuery({ queryKey: ['categorias'], queryFn: categoriasApi.listar })
  const { data: usuarios = [] } = useQuery({ queryKey: ['usuarios'], queryFn: usuariosApi.listar })
  const cidadaos = usuarios.filter(u => u.cargo === 'CIDADAO')

  const criar = useMutation({
    mutationFn: denunciasApi.criar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['denuncias'] })
      setShowForm(false)
      setForm({ tipoIdentificacao: 'ANONIMO' })
    },
  })

  const deletar = useMutation({
    mutationFn: denunciasApi.deletar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['denuncias'] }),
  })

  const set = (field: keyof DenunciaRequest, value: unknown) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.categoriaId || !form.descricao || !form.localizacao || !form.tipoIdentificacao) return
    criar.mutate(form as DenunciaRequest)
  }

  return (
    <div>
      <PageHeader
        title="Denúncias"
        description="Denúncias registradas por cidadãos"
        action={
          <Button onClick={() => setShowForm(v => !v)}>
            <Plus size={14} /> Nova Denúncia
          </Button>
        }
      />
      <div className="p-8 space-y-4">
        {showForm && (
          <Card>
            <CardHeader><CardTitle>Registrar Denúncia</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
                <Field label="Categoria">
                  <select required value={form.categoriaId ?? ''} onChange={e => set('categoriaId', Number(e.target.value))} className={inputClass}>
                    <option value="">Selecionar...</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.tipoCategoria}</option>)}
                  </select>
                </Field>
                <Field label="Tipo">
                  <select value={form.tipoIdentificacao} onChange={e => set('tipoIdentificacao', e.target.value as TipoIdentificacao)} className={inputClass}>
                    <option value="ANONIMO">Anônimo</option>
                    <option value="IDENTIFICADO">Identificado</option>
                  </select>
                </Field>
                {form.tipoIdentificacao === 'IDENTIFICADO' && (
                  <Field label="Denunciante">
                    <select required value={form.denuncianteId ?? ''} onChange={e => set('denuncianteId', Number(e.target.value))} className={inputClass}>
                      <option value="">Selecionar...</option>
                      {cidadaos.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
                    </select>
                  </Field>
                )}
                <Field label="Localização">
                  <input required value={form.localizacao ?? ''} onChange={e => set('localizacao', e.target.value)} placeholder="Endereço do problema" className={inputClass} />
                </Field>
                <Field label="Descrição">
                  <textarea required rows={3} value={form.descricao ?? ''} onChange={e => set('descricao', e.target.value)} placeholder="Descreva o problema..." className={`${inputClass} resize-none`} />
                </Field>
                {criar.error && <p className="text-xs text-red-500">{(criar.error as Error).message}</p>}
                <div className="flex gap-2 pt-1">
                  <Button type="submit" disabled={criar.isPending}>{criar.isPending ? 'Salvando...' : 'Registrar'}</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancelar</Button>
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
                  <Th>Protocolo</Th>
                  <Th>Categoria</Th>
                  <Th>Localização</Th>
                  <Th>Tipo</Th>
                  <Th>Data</Th>
                  <Th></Th>
                </tr>
              </Thead>
              <Tbody>
                {data.map(d => (
                  <Tr key={d.id}>
                    <Td><span className="font-mono text-xs text-slate-500">{d.protocolo}</span></Td>
                    <Td>{d.categoria.tipoCategoria}</Td>
                    <Td className="max-w-[200px] truncate">{d.localizacao}</Td>
                    <Td>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${d.tipoIdentificacao === 'ANONIMO' ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'}`}>
                        {d.tipoIdentificacao === 'ANONIMO' ? 'Anônimo' : 'Identificado'}
                      </span>
                    </Td>
                    <Td className="text-xs text-slate-500">{new Date(d.criadoEm).toLocaleDateString('pt-BR')}</Td>
                    <Td>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { if (confirm('Deletar esta denúncia?')) deletar.mutate(d.id) }}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </Td>
                  </Tr>
                ))}
                {data.length === 0 && (
                  <Tr><Td colSpan={6} className="text-center text-slate-400 py-8">Nenhuma denúncia encontrada.</Td></Tr>
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
