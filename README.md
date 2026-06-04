# Sistema de Solicitações Urbanas

AEP Engenharia de Software — Segunda Entrega. Migração de Python para Java Spring Boot.

## Objetivo

Sistema REST para gerenciamento de solicitações urbanas, denúncias e atendimentos. Permite que cidadãos registrem problemas urbanos (buracos, iluminação, saúde, limpeza) e que funcionários públicos os atendam e atualizem o status.

## Tecnologias

| Tecnologia | Versão | Uso |
|---|---|---|
| Java | 17 | Linguagem |
| Spring Boot | 3.3.5 | Framework |
| Spring Data JPA | 3.3.5 | Persistência |
| H2 Database | — | Banco em memória |
| Lombok | — | Redução de boilerplate |
| SpringDoc OpenAPI | 2.6.0 | Swagger UI |
| Bean Validation | — | Validação de dados |
| Checkstyle | 3.3.1 | Análise estática |
| PMD | 3.21.2 | Análise estática |
| SpotBugs | 4.8.3.1 | Análise de bugs |

## Estrutura do Projeto

```
src/main/java/com/aep/urbano/
├── AepUrbanoApplication.java
├── config/
│   └── OpenApiConfig.java
├── controller/
│   ├── AtendimentoController.java
│   ├── CategoriaController.java
│   ├── DashboardController.java
│   ├── DenunciaController.java
│   ├── HistoricoController.java
│   ├── SolicitacaoController.java
│   └── UsuarioController.java
├── dto/
│   ├── request/          # DTOs de entrada (records com Bean Validation)
│   └── response/         # DTOs de saída (records imutáveis)
├── exception/
│   ├── BusinessException.java
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
├── model/
│   ├── enums/            # StatusSolicitacao, Prioridade, Cargo, TipoCategoria, TipoIdentificacao
│   ├── Atendimento.java
│   ├── Categoria.java
│   ├── Denuncia.java
│   ├── Historico.java
│   ├── Solicitacao.java
│   └── Usuario.java
├── repository/           # Spring Data JPA repositories
└── service/              # Toda a lógica de negócio
```

## Como Executar

**Pré-requisitos:** Java 17, Maven 3.8+

```bash
# Clonar e entrar na pasta
cd AEP_entrega_2

# Executar
mvn spring-boot:run
```

A aplicação sobe na porta `8080`.

- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:aepdb`, user: `sa`, senha: vazio)
- **API Docs:** http://localhost:8080/api-docs

## Endpoints Disponíveis

### Usuários
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/usuarios | Listar todos |
| GET | /api/v1/usuarios/{id} | Buscar por ID |
| POST | /api/v1/usuarios | Criar |
| PUT | /api/v1/usuarios/{id} | Atualizar |
| DELETE | /api/v1/usuarios/{id} | Deletar |

### Solicitações
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/solicitacoes | Listar (filtros: `prioridade`, `tipoCategoria`) |
| GET | /api/v1/solicitacoes/{id} | Buscar por ID |
| GET | /api/v1/solicitacoes/protocolo/{protocolo} | Buscar por protocolo |
| GET | /api/v1/solicitacoes/atrasadas | Listar atrasadas |
| GET | /api/v1/solicitacoes/pendentes | Fila de atendimento |
| POST | /api/v1/solicitacoes | Criar |
| PATCH | /api/v1/solicitacoes/{id}/status | Atualizar status |
| DELETE | /api/v1/solicitacoes/{id} | Deletar |

### Denúncias
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/denuncias | Listar todas |
| GET | /api/v1/denuncias/{id} | Buscar por ID |
| GET | /api/v1/denuncias/protocolo/{protocolo} | Buscar por protocolo |
| POST | /api/v1/denuncias | Registrar |
| DELETE | /api/v1/denuncias/{id} | Deletar |

### Categorias
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/categorias | Listar todas |
| GET | /api/v1/categorias/{id} | Buscar por ID |
| POST | /api/v1/categorias | Criar |
| PUT | /api/v1/categorias/{id} | Atualizar |
| DELETE | /api/v1/categorias/{id} | Deletar |

### Histórico
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/historicos/solicitacao/{id} | Histórico de uma solicitação |

### Atendimentos
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/atendimentos | Listar todos |
| GET | /api/v1/atendimentos/{id} | Buscar por ID |
| GET | /api/v1/atendimentos/solicitacao/{id} | Por solicitação |
| POST | /api/v1/atendimentos | Registrar |
| DELETE | /api/v1/atendimentos/{id} | Deletar |

### Dashboard e Relatórios
| Método | Endpoint | Descrição |
|---|---|---|
| GET | /api/v1/dashboard | Totais e indicadores |
| GET | /api/v1/relatorios/solicitacoes?inicio=&fim= | Por período |
| GET | /api/v1/relatorios/denuncias?inicio=&fim= | Por período |
| GET | /api/v1/relatorios/solicitacoes/categoria?tipoCategoria= | Por categoria |

## Exemplos de Requisições Postman

### 1. Criar usuário cidadão
```json
POST /api/v1/usuarios
{
  "nome": "João Silva",
  "documento": "12345678901",
  "cargo": "CIDADAO"
}
```

### 2. Criar solicitação identificada
```json
POST /api/v1/solicitacoes
{
  "categoriaId": 1,
  "descricao": "Buraco grande na Rua das Flores próximo ao número 123",
  "localizacao": "Rua das Flores, 123 - Centro",
  "tipoIdentificacao": "IDENTIFICADO",
  "prioridade": "ALTA",
  "cidadaoId": 2
}
```

### 3. Criar denúncia anônima
```json
POST /api/v1/denuncias
{
  "categoriaId": 1,
  "descricao": "Lâmpada apagada há mais de 30 dias na praça central",
  "localizacao": "Praça Central",
  "tipoIdentificacao": "ANONIMO"
}
```

### 4. Atualizar status da solicitação
```json
PATCH /api/v1/solicitacoes/1/status
{
  "novoStatus": "EM_EXECUCAO",
  "responsavelId": 1,
  "comentario": "Equipe de manutenção designada para o local"
}
```

### 5. Registrar atendimento
```json
POST /api/v1/atendimentos
{
  "solicitacaoId": 1,
  "atendenteId": 1,
  "observacoes": "Problema verificado in loco. Reparo programado para amanhã."
}
```

### 6. Dashboard
```
GET /api/v1/dashboard
```

### 7. Relatório por período
```
GET /api/v1/relatorios/solicitacoes?inicio=2026-01-01&fim=2026-12-31
```

## Fluxo de Status das Solicitações

```
ABERTO → TRIAGEM → EM_EXECUCAO → RESOLVIDO → ENCERRADO
ABERTO → EM_EXECUCAO (direto)
ABERTO → RESOLVIDO (direto)
ABERTO → ENCERRADO (direto)
```

## Prioridades e SLA

| Prioridade | SLA (dias) | Impacto |
|---|---|---|
| CRITICA | 1 | Impacto social alto |
| ALTA | 3 | Impacto relevante |
| MEDIA | 7 | Impacto moderado |
| BAIXA | 15 | Impacto localizado |

## Análise Estática

```bash
# Checkstyle
mvn checkstyle:check

# PMD
mvn pmd:check

# SpotBugs
mvn spotbugs:check

# Gerar relatório site completo
mvn site
```

## SOLID Aplicado

| Princípio | Onde |
|---|---|
| **SRP** | Cada Service tem responsabilidade única; Controllers só roteiam |
| **OCP** | Enums com métodos (`podeTranzicionarPara`, `getSlaDias`) extensíveis sem quebrar código existente |
| **LSP** | Todas as implementações de repository substituem `JpaRepository` sem surpresas |
| **ISP** | Repositories estendem apenas `JpaRepository` com métodos relevantes |
| **DIP** | Services dependem de abstrações (interfaces de Repository), injetadas via `@RequiredArgsConstructor` |
