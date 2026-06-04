package com.aep.urbano.controller;

import com.aep.urbano.dto.response.DashboardResponse;
import com.aep.urbano.dto.response.DenunciaResponse;
import com.aep.urbano.dto.response.RelatorioResponse;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Tag(name = "Dashboard e Relatórios", description = "Indicadores e relatórios gerenciais")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/dashboard")
    @Operation(summary = "Dashboard geral do sistema")
    public ResponseEntity<DashboardResponse> dashboard() {
        return ResponseEntity.ok(dashboardService.obterDashboard());
    }

    @GetMapping("/relatorios/solicitacoes")
    @Operation(summary = "Relatório de solicitações por período")
    public ResponseEntity<RelatorioResponse<SolicitacaoResponse>> relatorioSolicitacoes(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(dashboardService.relatorioSolicitacoesPorPeriodo(inicio, fim));
    }

    @GetMapping("/relatorios/denuncias")
    @Operation(summary = "Relatório de denúncias por período")
    public ResponseEntity<RelatorioResponse<DenunciaResponse>> relatorioDenuncias(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fim) {
        return ResponseEntity.ok(dashboardService.relatorioDenunciasPorPeriodo(inicio, fim));
    }

    @GetMapping("/relatorios/solicitacoes/categoria")
    @Operation(summary = "Relatório de solicitações por categoria")
    public ResponseEntity<RelatorioResponse<SolicitacaoResponse>> relatorioSolicitacoesPorCategoria(
            @RequestParam TipoCategoria tipoCategoria) {
        return ResponseEntity.ok(dashboardService.relatorioSolicitacoesPorCategoria(tipoCategoria));
    }
}
