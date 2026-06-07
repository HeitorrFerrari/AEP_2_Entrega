package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.Cargo;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String documento,
        String telefone,
        String email,
        String endereco,
        Cargo cargo,
        LocalDateTime criadoEm
) {}
