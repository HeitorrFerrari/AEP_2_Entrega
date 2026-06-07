package com.aep.urbano.service;

import com.aep.urbano.dto.request.AtendimentoRequest;
import com.aep.urbano.dto.response.AtendimentoResponse;

import java.util.List;

public interface AtendimentoService {

    List<AtendimentoResponse> listarTodos();

    List<AtendimentoResponse> listarPorSolicitacao(Long solicitacaoId);

    AtendimentoResponse buscarPorId(Long id);

    AtendimentoResponse criar(AtendimentoRequest request);

    void deletar(Long id);
}
