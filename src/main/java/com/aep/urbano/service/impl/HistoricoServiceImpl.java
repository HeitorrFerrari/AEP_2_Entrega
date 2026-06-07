package com.aep.urbano.service.impl;

import com.aep.urbano.dto.response.HistoricoResponse;
import com.aep.urbano.repository.HistoricoRepository;
import com.aep.urbano.service.HistoricoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class HistoricoServiceImpl implements HistoricoService {

    private final HistoricoRepository historicoRepository;

    @Override
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
