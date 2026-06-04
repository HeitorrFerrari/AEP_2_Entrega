package com.aep.urbano.repository;

import com.aep.urbano.model.Categoria;
import com.aep.urbano.model.enums.TipoCategoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByTipoCategoria(TipoCategoria tipoCategoria);
    boolean existsByTipoCategoria(TipoCategoria tipoCategoria);
}
