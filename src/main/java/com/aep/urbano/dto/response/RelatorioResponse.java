package com.aep.urbano.dto.response;

import java.time.LocalDate;
import java.util.List;

public record RelatorioResponse<T>(
        List<T> itens,
        long total,
        LocalDate inicio,
        LocalDate fim
) {}
