package com.aep.urbano.controller;

import com.aep.urbano.dto.request.LoginRequest;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.repository.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Auth", description = "Autenticação por documento")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Login por documento (CPF)")
    public ResponseEntity<UsuarioResponse> login(@Valid @RequestBody LoginRequest request) {
        Usuario usuario = usuarioRepository.findByDocumento(request.documento().strip())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com documento: " + request.documento()));

        return ResponseEntity.ok(new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getDocumento(),
                usuario.getTelefone(),
                usuario.getEmail(),
                usuario.getEndereco(),
                usuario.getCargo(),
                usuario.getCriadoEm()
        ));
    }
}
