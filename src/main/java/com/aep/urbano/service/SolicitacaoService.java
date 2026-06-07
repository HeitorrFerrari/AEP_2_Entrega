package com.aep.urbano.service;

import com.aep.urbano.dto.request.AtualizarStatusRequest;
import com.aep.urbano.dto.request.SolicitacaoRequest;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.model.Solicitacao;
import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.TipoCategoria;

import java.util.List;

public interface SolicitacaoService {

    List<SolicitacaoResponse> listarTodas(Prioridade prioridade, TipoCategoria tipoCategoria);

    SolicitacaoResponse buscarPorId(Long id);

    SolicitacaoResponse buscarPorProtocolo(String protocolo);

    List<SolicitacaoResponse> listarAtrasadas();

    List<SolicitacaoResponse> listarPorCidadao(Long cidadaoId);

    List<SolicitacaoResponse> listarPendentes();

    long contarAtrasadas();

    SolicitacaoResponse criar(SolicitacaoRequest request);

    SolicitacaoResponse atualizarStatus(Long id, AtualizarStatusRequest request);

    void deletar(Long id);

    Solicitacao buscarEntidade(Long id);

    SolicitacaoResponse toResponse(Solicitacao solicitacao);
}
