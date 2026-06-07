package com.aep.urbano.model.enums;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

public enum StatusSolicitacao {

    ABERTO {
        @Override
        public Set<StatusSolicitacao> transicoesPossiveis() {
            return EnumSet.of(TRIAGEM, EM_EXECUCAO, RESOLVIDO, ENCERRADO);
        }
    },
    TRIAGEM {
        @Override
        public Set<StatusSolicitacao> transicoesPossiveis() {
            return EnumSet.of(EM_EXECUCAO, RESOLVIDO, ENCERRADO);
        }
    },
    EM_EXECUCAO {
        @Override
        public Set<StatusSolicitacao> transicoesPossiveis() {
            return EnumSet.of(RESOLVIDO, ENCERRADO);
        }
    },
    RESOLVIDO {
        @Override
        public Set<StatusSolicitacao> transicoesPossiveis() {
            return EnumSet.of(ENCERRADO);
        }
    },
    ENCERRADO {
        @Override
        public Set<StatusSolicitacao> transicoesPossiveis() {
            return EnumSet.noneOf(StatusSolicitacao.class);
        }
    };

    public abstract Set<StatusSolicitacao> transicoesPossiveis();

    public boolean podeTranzicionarPara(StatusSolicitacao novoStatus) {
        return transicoesPossiveis().contains(novoStatus);
    }

    public boolean isFinal() {
        return this == RESOLVIDO || this == ENCERRADO;
    }

    public static List<StatusSolicitacao> statusFinais() {
        return Arrays.stream(values()).filter(StatusSolicitacao::isFinal).toList();
    }
}
