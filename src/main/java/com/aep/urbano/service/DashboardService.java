package com.aep.urbano.service;

import com.aep.urbano.dto.response.DashboardResponse;
import com.aep.urbano.dto.response.DenunciaResponse;
import com.aep.urbano.dto.response.RelatorioResponse;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.model.enums.TipoCategoria;

import java.time.LocalDate;

public interface DashboardService {

    DashboardResponse obterDashboard();

    RelatorioResponse<SolicitacaoResponse> relatorioSolicitacoesPorPeriodo(LocalDate inicio, LocalDate fim);

    RelatorioResponse<DenunciaResponse> relatorioDenunciasPorPeriodo(LocalDate inicio, LocalDate fim);

    RelatorioResponse<SolicitacaoResponse> relatorioSolicitacoesPorCategoria(TipoCategoria tipoCategoria);
}
