package com.aep.urbano.repository;

import com.aep.urbano.model.Denuncia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DenunciaRepository extends JpaRepository<Denuncia, Long> {
    Optional<Denuncia> findByProtocolo(String protocolo);
    List<Denuncia> findByCriadoEmBetween(LocalDateTime inicio, LocalDateTime fim);
}
