package com.aep.urbano.dto.request;

import com.aep.urbano.model.enums.StatusSolicitacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AtualizarStatusRequest(
        @NotNull StatusSolicitacao novoStatus,
        @NotNull Long responsavelId,
        @NotBlank String comentario,
        String justificativaAtraso
) {}
