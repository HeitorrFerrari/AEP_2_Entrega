package com.aep.urbano.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtendimentoRequest(
        @NotNull Long solicitacaoId,
        @NotNull Long atendenteId,
        @NotBlank String observacoes
) {}
