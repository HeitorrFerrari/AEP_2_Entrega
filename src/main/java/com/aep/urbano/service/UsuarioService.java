package com.aep.urbano.service;

import com.aep.urbano.dto.request.UsuarioRequest;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.model.Usuario;

import java.util.List;

public interface UsuarioService {

    List<UsuarioResponse> listarTodos();

    UsuarioResponse buscarPorId(Long id);

    UsuarioResponse criar(UsuarioRequest request);

    UsuarioResponse atualizar(Long id, UsuarioRequest request);

    void deletar(Long id);

    Usuario buscarEntidade(Long id);
}
