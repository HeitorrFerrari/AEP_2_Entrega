package com.aep.urbano.service;

import com.aep.urbano.dto.request.CategoriaRequest;
import com.aep.urbano.dto.response.CategoriaResponse;
import com.aep.urbano.model.Categoria;

import java.util.List;

public interface CategoriaService {

    List<CategoriaResponse> listarTodas();

    CategoriaResponse buscarPorId(Long id);

    CategoriaResponse criar(CategoriaRequest request);

    CategoriaResponse atualizar(Long id, CategoriaRequest request);

    void deletar(Long id);

    Categoria buscarEntidade(Long id);

    CategoriaResponse toResponse(Categoria categoria);
}
