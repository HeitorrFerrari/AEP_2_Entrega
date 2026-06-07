package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.StatusSolicitacao;

import java.time.LocalDateTime;

public record HistoricoResponse(
        Long id,
        StatusSolicitacao status,
        LocalDateTime dataMovimentacao,
        String nomeResponsavel,
        String comentario
) {}
