package com.aep.urbano.service;

import com.aep.urbano.dto.request.UsuarioRequest;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.existsByDocumento(request.documento())) {
            throw new BusinessException("Já existe um usuário com o documento: " + request.documento());
        }
        Usuario usuario = Usuario.builder()
                .nome(request.nome().strip())
                .documento(request.documento().strip())
                .cargo(request.cargo())
                .build();
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = buscarEntidade(id);
        if (!usuario.getDocumento().equals(request.documento())
                && usuarioRepository.existsByDocumento(request.documento())) {
            throw new BusinessException("Documento já cadastrado para outro usuário.");
        }
        usuario.setNome(request.nome().strip());
        usuario.setDocumento(request.documento().strip());
        usuario.setCargo(request.cargo());
        return toResponse(usuarioRepository.save(usuario));
    }

    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        usuarioRepository.deleteById(id);
    }

    public Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getDocumento(), u.getCargo(), u.getCriadoEm());
    }
}
