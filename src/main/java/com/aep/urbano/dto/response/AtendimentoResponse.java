package com.aep.urbano.dto.response;

import java.time.LocalDateTime;

public record AtendimentoResponse(
        Long id,
        Long solicitacaoId,
        String protocolo,
        UsuarioResponse atendente,
        String observacoes,
        LocalDateTime dataAtendimento
) {}
