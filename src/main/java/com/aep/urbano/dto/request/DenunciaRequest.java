package com.aep.urbano.dto.request;

import com.aep.urbano.model.enums.TipoIdentificacao;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record DenunciaRequest(
        @NotNull Long categoriaId,
        @NotBlank @Size(min = 20, message = "Descrição de denúncia deve ter ao menos 20 caracteres") String descricao,
        @NotBlank @Size(min = 3) String localizacao,
        @NotNull TipoIdentificacao tipoIdentificacao,
        Long denuncianteId
) {}
