package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.TipoIdentificacao;

import java.time.LocalDateTime;

public record DenunciaResponse(
        Long id,
        String protocolo,
        CategoriaResponse categoria,
        String descricao,
        String localizacao,
        TipoIdentificacao tipoIdentificacao,
        UsuarioResponse denunciante,
        LocalDateTime criadoEm
) {}
