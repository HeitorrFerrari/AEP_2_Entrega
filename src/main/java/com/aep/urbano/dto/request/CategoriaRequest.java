package com.aep.urbano.dto.request;

import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.model.enums.TipoIdentificacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CategoriaRequest(
        @NotNull TipoCategoria tipoCategoria,
        @NotBlank String descricao,
        @NotNull TipoIdentificacao identificacaoPermitida
) {}
