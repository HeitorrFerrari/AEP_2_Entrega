package com.aep.urbano.controller;

import com.aep.urbano.dto.request.DenunciaRequest;
import com.aep.urbano.dto.response.DenunciaResponse;
import com.aep.urbano.service.DenunciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/denuncias")
@RequiredArgsConstructor
@Tag(name = "Denúncias", description = "Registro e consulta de denúncias anônimas ou identificadas")
public class DenunciaController {

    private final DenunciaService denunciaService;

    @GetMapping
    @Operation(summary = "Listar todas as denúncias")
    public ResponseEntity<List<DenunciaResponse>> listarTodas() {
        return ResponseEntity.ok(denunciaService.listarTodas());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar denúncia por ID")
    public ResponseEntity<DenunciaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(denunciaService.buscarPorId(id));
    }

    @GetMapping("/protocolo/{protocolo}")
    @Operation(summary = "Buscar denúncia por protocolo")
    public ResponseEntity<DenunciaResponse> buscarPorProtocolo(@PathVariable String protocolo) {
        return ResponseEntity.ok(denunciaService.buscarPorProtocolo(protocolo));
    }

    @PostMapping
    @Operation(summary = "Registrar nova denúncia")
    public ResponseEntity<DenunciaResponse> criar(@Valid @RequestBody DenunciaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(denunciaService.criar(request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar denúncia")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        denunciaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
