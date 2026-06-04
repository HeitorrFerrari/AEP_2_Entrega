package com.aep.urbano.service;

import com.aep.urbano.dto.response.HistoricoResponse;
import com.aep.urbano.repository.HistoricoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoricoService {

    private final HistoricoRepository historicoRepository;

    public List<HistoricoResponse> listarPorSolicitacao(Long solicitacaoId) {
        return historicoRepository.findBySolicitacaoIdOrderByDataMovimentacaoDesc(solicitacaoId).stream()
                .map(h -> new HistoricoResponse(
                        h.getId(),
                        h.getStatus(),
                        h.getDataMovimentacao(),
                        h.getResponsavel().getNome(),
                        h.getComentario()))
                .toList();
    }
}
