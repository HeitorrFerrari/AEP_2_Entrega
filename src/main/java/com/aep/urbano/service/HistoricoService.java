package com.aep.urbano.service;

import com.aep.urbano.dto.response.HistoricoResponse;

import java.util.List;

public interface HistoricoService {

    List<HistoricoResponse> listarPorSolicitacao(Long solicitacaoId);
}
