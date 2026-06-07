package com.aep.urbano.service.impl;

import com.aep.urbano.dto.request.AtualizarStatusRequest;
import com.aep.urbano.dto.request.SolicitacaoRequest;
import com.aep.urbano.dto.response.CategoriaResponse;
import com.aep.urbano.dto.response.HistoricoResponse;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Categoria;
import com.aep.urbano.model.Historico;
import com.aep.urbano.model.Solicitacao;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.model.enums.TipoIdentificacao;
import com.aep.urbano.repository.HistoricoRepository;
import com.aep.urbano.repository.SolicitacaoRepository;
import com.aep.urbano.service.CategoriaService;
import com.aep.urbano.service.ProtocoloService;
import com.aep.urbano.service.SolicitacaoService;
import com.aep.urbano.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SolicitacaoServiceImpl implements SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final HistoricoRepository historicoRepository;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;
    private final ProtocoloService protocoloService;

    @Override
    public List<SolicitacaoResponse> listarTodas(Prioridade prioridade, TipoCategoria tipoCategoria) {
        List<Solicitacao> lista;

        if (prioridade != null && tipoCategoria != null) {
            lista = solicitacaoRepository.findByPrioridadeAndCategoriaTipoCategoria(prioridade, tipoCategoria);
        } else if (prioridade != null) {
            lista = solicitacaoRepository.findByPrioridade(prioridade);
        } else if (tipoCategoria != null) {
            lista = solicitacaoRepository.findByCategoriaTipoCategoria(tipoCategoria);
        } else {
            lista = solicitacaoRepository.findAll();
        }

        return lista.stream()
                .sorted(Comparator.comparingInt((Solicitacao s) -> -s.getPrioridade().getPeso())
                        .thenComparing(Solicitacao::getPrazoAlvo)
                        .thenComparing(Solicitacao::getCriadoEm))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public SolicitacaoResponse buscarPorProtocolo(String protocolo) {
        Solicitacao s = solicitacaoRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação com protocolo: " + protocolo));
        return toResponse(s);
    }

    @Override
    public SolicitacaoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Override
    public List<SolicitacaoResponse> listarPorCidadao(Long cidadaoId) {
        return solicitacaoRepository.findByCidadaoId(cidadaoId).stream()
                .sorted(Comparator.comparingInt((Solicitacao s) -> -s.getPrioridade().getPeso())
                        .thenComparing(Comparator.comparing(Solicitacao::getCriadoEm).reversed()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SolicitacaoResponse> listarAtrasadas() {
        return solicitacaoRepository.findAtrasadas(LocalDate.now(), StatusSolicitacao.statusFinais()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<SolicitacaoResponse> listarPendentes() {
        return solicitacaoRepository.findByStatusNotIn(StatusSolicitacao.statusFinais()).stream()
                .sorted(Comparator.comparingInt((Solicitacao s) -> -s.getPrioridade().getPeso())
                        .thenComparing(Solicitacao::getPrazoAlvo))
                .map(this::toResponse)
                .toList();
    }

    @Override
    public long contarAtrasadas() {
        return solicitacaoRepository.countAtrasadas(LocalDate.now(), StatusSolicitacao.statusFinais());
    }

    @Override
    @Transactional
    public SolicitacaoResponse criar(SolicitacaoRequest request) {
        Categoria categoria = categoriaService.buscarEntidade(request.categoriaId());
        validarAnonimato(request);

        Usuario cidadao = null;
        if (request.cidadaoId() != null) {
            cidadao = usuarioService.buscarEntidade(request.cidadaoId());
        }

        Solicitacao solicitacao = Solicitacao.builder()
                .protocolo(protocoloService.gerarProtocoloSolicitacao())
                .categoria(categoria)
                .descricao(request.descricao().strip())
                .localizacao(request.localizacao().strip())
                .tipoIdentificacao(request.tipoIdentificacao())
                .prioridade(request.prioridade())
                .cidadao(cidadao)
                .status(StatusSolicitacao.ABERTO)
                .build();

        return toResponse(solicitacaoRepository.save(solicitacao));
    }

    @Override
    @Transactional
    public SolicitacaoResponse atualizarStatus(Long id, AtualizarStatusRequest request) {
        Solicitacao solicitacao = buscarEntidade(id);
        Usuario responsavel = usuarioService.buscarEntidade(request.responsavelId());

        validarTransicaoStatus(solicitacao, request.novoStatus());
        validarJustificativaSeAtrasada(solicitacao, request.justificativaAtraso());

        solicitacao.setStatus(request.novoStatus());
        if (request.justificativaAtraso() != null && !request.justificativaAtraso().isBlank()) {
            solicitacao.setJustificativaAtraso(request.justificativaAtraso().strip());
        }

        Historico movimentacao = Historico.builder()
                .solicitacao(solicitacao)
                .status(request.novoStatus())
                .responsavel(responsavel)
                .comentario(request.comentario().strip())
                .build();

        historicoRepository.save(movimentacao);
        return toResponse(solicitacaoRepository.save(solicitacao));
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        solicitacaoRepository.deleteById(id);
    }

    @Override
    public Solicitacao buscarEntidade(Long id) {
        return solicitacaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id));
    }

    @Override
    public SolicitacaoResponse toResponse(Solicitacao s) {
        List<HistoricoResponse> hist = s.getHistorico().stream()
                .map(h -> new HistoricoResponse(
                        h.getId(),
                        h.getStatus(),
                        h.getDataMovimentacao(),
                        h.getResponsavel().getNome(),
                        h.getComentario()))
                .toList();

        UsuarioResponse cidadaoResp = s.getCidadao() == null ? null :
                new UsuarioResponse(s.getCidadao().getId(), s.getCidadao().getNome(),
                        s.getCidadao().getDocumento(), s.getCidadao().getTelefone(),
                        s.getCidadao().getEmail(), s.getCidadao().getEndereco(),
                        s.getCidadao().getCargo(), s.getCidadao().getCriadoEm());

        CategoriaResponse catResp = categoriaService.toResponse(s.getCategoria());

        return new SolicitacaoResponse(
                s.getId(), s.getProtocolo(), catResp,
                s.getDescricao(), s.getLocalizacao(),
                s.getTipoIdentificacao(), s.getPrioridade(),
                s.getPrioridade().getImpactoSocial(),
                cidadaoResp, s.getStatus(),
                s.getCriadoEm(), s.getPrazoAlvo(),
                s.isAtrasada(), s.getJustificativaAtraso(),
                hist);
    }

    private void validarAnonimato(SolicitacaoRequest request) {
        if (request.tipoIdentificacao() == TipoIdentificacao.ANONIMO) {
            if (request.cidadaoId() != null) {
                throw new BusinessException("Solicitação anônima não pode conter dados pessoais.");
            }
            if (request.descricao().strip().length() < 20) {
                throw new BusinessException("Solicitação anônima exige descrição com mínimo de 20 caracteres.");
            }
            if (request.localizacao().strip().length() < 3) {
                throw new BusinessException("Solicitação anônima exige localização com mínimo de 3 caracteres.");
            }
        }
        if (request.tipoIdentificacao() == TipoIdentificacao.IDENTIFICADO && request.cidadaoId() == null) {
            throw new BusinessException("Solicitação identificada exige cidadaoId.");
        }
    }

    private void validarTransicaoStatus(Solicitacao solicitacao, StatusSolicitacao novoStatus) {
        if (!solicitacao.getStatus().podeTranzicionarPara(novoStatus)) {
            throw new BusinessException(String.format(
                    "Transição inválida: %s → %s", solicitacao.getStatus(), novoStatus));
        }
    }

    private void validarJustificativaSeAtrasada(Solicitacao solicitacao, String justificativa) {
        if (solicitacao.isAtrasada() && (justificativa == null || justificativa.isBlank())) {
            throw new BusinessException("Solicitação atrasada exige justificativa de atraso.");
        }
    }
}
