export type Cargo = 'CIDADAO' | 'FUNCIONARIO_PUBLICO'
export type StatusSolicitacao = 'ABERTO' | 'TRIAGEM' | 'EM_EXECUCAO' | 'RESOLVIDO' | 'ENCERRADO'
export type Prioridade = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA'
export type TipoCategoria = 'ILUMINACAO' | 'BURACO' | 'PODA' | 'SAUDE' | 'LIMPEZA' | 'OUTRO'
export type TipoIdentificacao = 'ANONIMO' | 'IDENTIFICADO'

export interface UsuarioResponse {
  id: number
  nome: string
  documento: string
  telefone?: string
  email?: string
  endereco?: string
  cargo: Cargo
  criadoEm: string
}

export interface CategoriaResponse {
  id: number
  tipoCategoria: TipoCategoria
  descricao: string
  identificacaoPermitida: TipoIdentificacao
}

export interface HistoricoResponse {
  id: number
  status: StatusSolicitacao
  dataMovimentacao: string
  nomeResponsavel: string
  comentario: string
}

export interface SolicitacaoResponse {
  id: number
  protocolo: string
  categoria: CategoriaResponse
  descricao: string
  localizacao: string
  tipoIdentificacao: TipoIdentificacao
  prioridade: Prioridade
  impactoSocial: string
  cidadao: UsuarioResponse | null
  status: StatusSolicitacao
  criadoEm: string
  prazoAlvo: string
  atrasada: boolean
  justificativaAtraso: string | null
  historico: HistoricoResponse[]
}

export interface DenunciaResponse {
  id: number
  protocolo: string
  categoria: CategoriaResponse
  descricao: string
  localizacao: string
  tipoIdentificacao: TipoIdentificacao
  denunciante: UsuarioResponse | null
  criadoEm: string
}

export interface DashboardResponse {
  totalSolicitacoes: number
  totalDenuncias: number
  atrasadas: number
  porStatus: Record<StatusSolicitacao, number>
  porCategoria: Record<TipoCategoria, number>
}

export interface SolicitacaoRequest {
  categoriaId: number
  descricao: string
  localizacao: string
  tipoIdentificacao: TipoIdentificacao
  prioridade: Prioridade
  cidadaoId?: number
}

export interface DenunciaRequest {
  categoriaId: number
  descricao: string
  localizacao: string
  tipoIdentificacao: TipoIdentificacao
  denuncianteId?: number
}

export interface AtualizarStatusRequest {
  novoStatus: StatusSolicitacao
  responsavelId: number
  comentario: string
  justificativaAtraso?: string
}

export interface UsuarioRequest {
  nome: string
  documento: string
  telefone?: string
  email?: string
  endereco?: string
  cargo: Cargo
}
