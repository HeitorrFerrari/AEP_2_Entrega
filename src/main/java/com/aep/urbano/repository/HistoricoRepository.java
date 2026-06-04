package com.aep.urbano.repository;

import com.aep.urbano.model.Historico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoricoRepository extends JpaRepository<Historico, Long> {
    List<Historico> findBySolicitacaoIdOrderByDataMovimentacaoDesc(Long solicitacaoId);
}
