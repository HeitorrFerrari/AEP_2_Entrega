package com.aep.urbano.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ErroResponse(
        int status,
        String erro,
        String mensagem,
        LocalDateTime timestamp,
        List<String> detalhes
) {}
