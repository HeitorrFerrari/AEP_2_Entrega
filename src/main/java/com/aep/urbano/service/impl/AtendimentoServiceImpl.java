package com.aep.urbano.service.impl;

import com.aep.urbano.dto.request.AtendimentoRequest;
import com.aep.urbano.dto.response.AtendimentoResponse;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Atendimento;
import com.aep.urbano.model.Solicitacao;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.model.enums.Cargo;
import com.aep.urbano.repository.AtendimentoRepository;
import com.aep.urbano.service.AtendimentoService;
import com.aep.urbano.service.SolicitacaoService;
import com.aep.urbano.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AtendimentoServiceImpl implements AtendimentoService {

    private final AtendimentoRepository atendimentoRepository;
    private final SolicitacaoService solicitacaoService;
    private final UsuarioService usuarioService;

    @Override
    public List<AtendimentoResponse> listarTodos() {
        return atendimentoRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public List<AtendimentoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return atendimentoRepository.findBySolicitacaoId(solicitacaoId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public AtendimentoResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Override
    @Transactional
    public AtendimentoResponse criar(AtendimentoRequest request) {
        Solicitacao solicitacao = solicitacaoService.buscarEntidade(request.solicitacaoId());
        Usuario atendente = usuarioService.buscarEntidade(request.atendenteId());

        if (!atendente.getCargo().podeAtender()) {
            throw new BusinessException("Apenas funcionários públicos podem registrar atendimentos.");
        }

        Atendimento atendimento = Atendimento.builder()
                .solicitacao(solicitacao)
                .atendente(atendente)
                .observacoes(request.observacoes().strip())
                .build();

        return toResponse(atendimentoRepository.save(atendimento));
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        atendimentoRepository.deleteById(id);
    }

    private Atendimento buscarEntidade(Long id) {
        return atendimentoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atendimento", id));
    }

    private AtendimentoResponse toResponse(Atendimento a) {
        UsuarioResponse atendenteResp = new UsuarioResponse(
                a.getAtendente().getId(), a.getAtendente().getNome(),
                a.getAtendente().getDocumento(), a.getAtendente().getCargo(),
                a.getAtendente().getCriadoEm());

        return new AtendimentoResponse(
                a.getId(),
                a.getSolicitacao().getId(),
                a.getSolicitacao().getProtocolo(),
                atendenteResp,
                a.getObservacoes(),
                a.getDataAtendimento());
    }
}
