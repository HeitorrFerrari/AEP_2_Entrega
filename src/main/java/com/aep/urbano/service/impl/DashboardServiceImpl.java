package com.aep.urbano.service.impl;

import com.aep.urbano.dto.response.DashboardResponse;
import com.aep.urbano.dto.response.DenunciaResponse;
import com.aep.urbano.dto.response.RelatorioResponse;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.repository.DenunciaRepository;
import com.aep.urbano.repository.SolicitacaoRepository;
import com.aep.urbano.service.DashboardService;
import com.aep.urbano.service.DenunciaService;
import com.aep.urbano.service.SolicitacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final DenunciaRepository denunciaRepository;
    private final SolicitacaoService solicitacaoService;
    private final DenunciaService denunciaService;

    @Override
    public DashboardResponse obterDashboard() {
        long totalSolicitacoes = solicitacaoRepository.count();
        long totalDenuncias = denunciaRepository.count();
        long atrasadas = solicitacaoService.contarAtrasadas();

        Map<StatusSolicitacao, Long> porStatus = new LinkedHashMap<>();
        for (Object[] row : solicitacaoRepository.countGroupedByStatus()) {
            porStatus.put((StatusSolicitacao) row[0], (Long) row[1]);
        }

        Map<TipoCategoria, Long> porCategoria = new LinkedHashMap<>();
        for (Object[] row : solicitacaoRepository.countGroupedByCategoria()) {
            porCategoria.put((TipoCategoria) row[0], (Long) row[1]);
        }

        return new DashboardResponse(totalSolicitacoes, totalDenuncias, atrasadas, porStatus, porCategoria);
    }

    @Override
    public RelatorioResponse<SolicitacaoResponse> relatorioSolicitacoesPorPeriodo(LocalDate inicio, LocalDate fim) {
        LocalDateTime inicioTs = inicio.atStartOfDay();
        LocalDateTime fimTs = fim.atTime(23, 59, 59);
        List<SolicitacaoResponse> itens = solicitacaoRepository.findByCriadoEmBetween(inicioTs, fimTs).stream()
                .map(solicitacaoService::toResponse)
                .toList();
        return new RelatorioResponse<>(itens, itens.size(), inicio, fim);
    }

    @Override
    public RelatorioResponse<DenunciaResponse> relatorioDenunciasPorPeriodo(LocalDate inicio, LocalDate fim) {
        List<DenunciaResponse> itens = denunciaService.listarPorPeriodo(inicio, fim);
        return new RelatorioResponse<>(itens, itens.size(), inicio, fim);
    }

    @Override
    public RelatorioResponse<SolicitacaoResponse> relatorioSolicitacoesPorCategoria(TipoCategoria tipoCategoria) {
        List<SolicitacaoResponse> itens = solicitacaoService.listarTodas(null, tipoCategoria);
        return new RelatorioResponse<>(itens, itens.size(), null, null);
    }
}
