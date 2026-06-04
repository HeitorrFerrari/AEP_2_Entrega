package com.aep.urbano.controller;

import com.aep.urbano.dto.response.HistoricoResponse;
import com.aep.urbano.service.HistoricoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/historicos")
@RequiredArgsConstructor
@Tag(name = "Histórico", description = "Consulta de movimentações de solicitações")
public class HistoricoController {

    private final HistoricoService historicoService;

    @GetMapping("/solicitacao/{solicitacaoId}")
    @Operation(summary = "Listar histórico de uma solicitação")
    public ResponseEntity<List<HistoricoResponse>> listarPorSolicitacao(@PathVariable Long solicitacaoId) {
        return ResponseEntity.ok(historicoService.listarPorSolicitacao(solicitacaoId));
    }
}
