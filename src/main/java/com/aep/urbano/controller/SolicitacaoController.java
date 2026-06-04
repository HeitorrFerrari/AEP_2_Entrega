package com.aep.urbano.controller;

import com.aep.urbano.dto.request.AtualizarStatusRequest;
import com.aep.urbano.dto.request.SolicitacaoRequest;
import com.aep.urbano.dto.response.SolicitacaoResponse;
import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/solicitacoes")
@RequiredArgsConstructor
@Tag(name = "Solicitações", description = "Criação, consulta e atualização de solicitações urbanas")
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @GetMapping
    @Operation(summary = "Listar solicitações com filtros opcionais")
    public ResponseEntity<List<SolicitacaoResponse>> listarTodas(
            @RequestParam(required = false) Prioridade prioridade,
            @RequestParam(required = false) TipoCategoria tipoCategoria) {
        return ResponseEntity.ok(solicitacaoService.listarTodas(prioridade, tipoCategoria));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar solicitação por ID")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    @GetMapping("/protocolo/{protocolo}")
    @Operation(summary = "Buscar solicitação por protocolo")
    public ResponseEntity<SolicitacaoResponse> buscarPorProtocolo(@PathVariable String protocolo) {
        return ResponseEntity.ok(solicitacaoService.buscarPorProtocolo(protocolo));
    }

    @GetMapping("/atrasadas")
    @Operation(summary = "Listar solicitações atrasadas")
    public ResponseEntity<List<SolicitacaoResponse>> listarAtrasadas() {
        return ResponseEntity.ok(solicitacaoService.listarAtrasadas());
    }

    @GetMapping("/pendentes")
    @Operation(summary = "Listar solicitações pendentes (fila de atendimento)")
    public ResponseEntity<List<SolicitacaoResponse>> listarPendentes() {
        return ResponseEntity.ok(solicitacaoService.listarPendentes());
    }

    @PostMapping
    @Operation(summary = "Criar nova solicitação")
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(solicitacaoService.criar(request));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status da solicitação")
    public ResponseEntity<SolicitacaoResponse> atualizarStatus(
            @PathVariable Long id,
            @Valid @RequestBody AtualizarStatusRequest request) {
        return ResponseEntity.ok(solicitacaoService.atualizarStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar solicitação")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        solicitacaoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
