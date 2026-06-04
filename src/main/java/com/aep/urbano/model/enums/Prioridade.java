package com.aep.urbano.model.enums;

public enum Prioridade {

    BAIXA(15, 1, "Impacto localizado"),
    MEDIA(7, 2, "Impacto moderado"),
    ALTA(3, 3, "Impacto relevante"),
    CRITICA(1, 4, "Impacto social alto");

    private final int slaDias;
    private final int peso;
    private final String impactoSocial;

    Prioridade(int slaDias, int peso, String impactoSocial) {
        this.slaDias = slaDias;
        this.peso = peso;
        this.impactoSocial = impactoSocial;
    }

    public int getSlaDias() {
        return slaDias;
    }

    public int getPeso() {
        return peso;
    }

    public String getImpactoSocial() {
        return impactoSocial;
    }
}
