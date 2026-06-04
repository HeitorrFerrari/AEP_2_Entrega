package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.TipoCategoria;
import com.aep.urbano.model.enums.TipoIdentificacao;

public record CategoriaResponse(
        Long id,
        TipoCategoria tipoCategoria,
        String descricao,
        TipoIdentificacao identificacaoPermitida
) {}
