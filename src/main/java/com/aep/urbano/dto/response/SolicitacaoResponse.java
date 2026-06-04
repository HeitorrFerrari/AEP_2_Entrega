package com.aep.urbano.dto.response;

import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoIdentificacao;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record SolicitacaoResponse(
        Long id,
        String protocolo,
        CategoriaResponse categoria,
        String descricao,
        String localizacao,
        TipoIdentificacao tipoIdentificacao,
        Prioridade prioridade,
        String impactoSocial,
        UsuarioResponse cidadao,
        StatusSolicitacao status,
        LocalDateTime criadoEm,
        LocalDate prazoAlvo,
        boolean atrasada,
        String justificativaAtraso,
        List<HistoricoResponse> historico
) {}
