package com.aep.urbano.repository;

import com.aep.urbano.model.Atendimento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtendimentoRepository extends JpaRepository<Atendimento, Long> {
    List<Atendimento> findBySolicitacaoId(Long solicitacaoId);
    List<Atendimento> findByAtendenteId(Long atendenteId);
}
