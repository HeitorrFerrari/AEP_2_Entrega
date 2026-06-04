package com.aep.urbano.controller;

import com.aep.urbano.dto.request.AtendimentoRequest;
import com.aep.urbano.dto.response.AtendimentoResponse;
import com.aep.urbano.service.AtendimentoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/atendimentos")
@RequiredArgsConstructor
@Tag(name = "Atendimentos", description = "Registro de atendimentos realizados por funcionários públicos")
public class AtendimentoController {

    private final AtendimentoService atendimentoService;

    @GetMapping
    @Operation(summary = "Listar todos os atendimentos")
    public ResponseEntity<List<AtendimentoResponse>> listarTodos() {
        return ResponseEntity.ok(atendimentoService.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar atendimento por ID")
    public ResponseEntity<AtendimentoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atendimentoService.buscarPorId(id));
    }

    @GetMapping("/solicitacao/{solicitacaoId}")
    @Operation(summary = "Listar atendimentos de uma solicitação")
    public ResponseEntity<List<AtendimentoResponse>> listarPorSolicitacao(@PathVariable Long solicitacaoId) {
        return ResponseEntity.ok(atendimentoService.listarPorSolicitacao(solicitacaoId));
    }

    @PostMapping
    @Operation(summary = "Registrar novo atendimento")
    public ResponseEntity<AtendimentoResponse> criar(@Valid @RequestBody AtendimentoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(atendimentoService.criar(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar atendimento")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        atendimentoService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
