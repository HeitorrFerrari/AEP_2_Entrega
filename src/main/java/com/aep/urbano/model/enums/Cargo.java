package com.aep.urbano.model.enums;

public enum Cargo {
    CIDADAO,
    FUNCIONARIO_PUBLICO;

    public boolean podeAtender() {
        return this == FUNCIONARIO_PUBLICO;
    }
}
