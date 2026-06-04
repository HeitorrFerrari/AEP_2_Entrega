package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoCategoria;

import java.util.Map;

public record DashboardResponse(
        long totalSolicitacoes,
        long totalDenuncias,
        long solicitacoesAtrasadas,
        Map<StatusSolicitacao, Long> solicitacoesPorStatus,
        Map<TipoCategoria, Long> categoriasMaisUsadas
) {}
