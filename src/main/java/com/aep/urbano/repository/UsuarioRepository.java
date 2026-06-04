package com.aep.urbano.repository;

import com.aep.urbano.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByDocumento(String documento);
    boolean existsByDocumento(String documento);
}
