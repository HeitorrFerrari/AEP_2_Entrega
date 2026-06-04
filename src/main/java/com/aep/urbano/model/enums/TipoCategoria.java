package com.aep.urbano.model.enums;

public enum TipoCategoria {
    ILUMINACAO("Iluminação pública"),
    BURACO("Buraco nas ruas"),
    PODA("Podagem de árvores irregulares"),
    SAUDE("Dúvidas ou solicitação relacionada à saúde"),
    LIMPEZA("Limpeza e zeladoria"),
    OUTRO("Outro");

    private final String descricao;

    TipoCategoria(String descricao) {
        this.descricao = descricao;
    }

    public String getDescricao() {
        return descricao;
    }
}
