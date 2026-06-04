package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.Cargo;

import java.time.LocalDateTime;

public record UsuarioResponse(
        Long id,
        String nome,
        String documento,
        Cargo cargo,
        LocalDateTime criadoEm
) {}
