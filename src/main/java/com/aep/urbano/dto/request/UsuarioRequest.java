package com.aep.urbano.dto.request;

import com.aep.urbano.model.enums.Cargo;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UsuarioRequest(
        @NotBlank String nome,
        @NotBlank String documento,
        @NotNull Cargo cargo
) {}
