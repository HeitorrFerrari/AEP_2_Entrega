package com.aep.urbano.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(@NotBlank String documento) {}
