package com.aep.urbano.repository;

import com.aep.urbano.model.Solicitacao;
import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    Optional<Solicitacao> findByProtocolo(String protocolo);

    List<Solicitacao> findByCidadaoId(Long cidadaoId);

    List<Solicitacao> findByPrioridade(Prioridade prioridade);

    List<Solicitacao> findByCategoriaTipoCategoria(TipoCategoria tipoCategoria);

    List<Solicitacao> findByPrioridadeAndCategoriaTipoCategoria(Prioridade prioridade, TipoCategoria tipoCategoria);

    List<Solicitacao> findByStatus(StatusSolicitacao status);

    List<Solicitacao> findByCriadoEmBetween(LocalDateTime inicio, LocalDateTime fim);

    @Query("SELECT s.status, COUNT(s) FROM Solicitacao s GROUP BY s.status")
    List<Object[]> countGroupedByStatus();

    @Query("SELECT s.categoria.tipoCategoria, COUNT(s) FROM Solicitacao s GROUP BY s.categoria.tipoCategoria ORDER BY COUNT(s) DESC")
    List<Object[]> countGroupedByCategoria();

    List<Solicitacao> findByStatusNotIn(List<StatusSolicitacao> statusList);

    @Query("SELECT s FROM Solicitacao s WHERE s.prazoAlvo < :hoje AND s.status NOT IN :statusFinais")
    List<Solicitacao> findAtrasadas(
            @Param("hoje") LocalDate hoje,
            @Param("statusFinais") List<StatusSolicitacao> statusFinais);

    @Query("SELECT COUNT(s) FROM Solicitacao s WHERE s.prazoAlvo < :hoje AND s.status NOT IN :statusFinais")
    long countAtrasadas(
            @Param("hoje") LocalDate hoje,
            @Param("statusFinais") List<StatusSolicitacao> statusFinais);
}
