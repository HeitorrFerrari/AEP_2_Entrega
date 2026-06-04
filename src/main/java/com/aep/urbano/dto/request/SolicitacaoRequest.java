package com.aep.urbano.dto.request;

import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.TipoIdentificacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record SolicitacaoRequest(
        @NotNull Long categoriaId,
        @NotBlank @Size(min = 10, message = "Descrição deve ter ao menos 10 caracteres") String descricao,
        @NotBlank String localizacao,
        @NotNull TipoIdentificacao tipoIdentificacao,
        @NotNull Prioridade prioridade,
        Long cidadaoId
) {}
