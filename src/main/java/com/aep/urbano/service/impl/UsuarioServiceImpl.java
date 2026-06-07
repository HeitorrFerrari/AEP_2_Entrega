package com.aep.urbano.service.impl;

import com.aep.urbano.dto.request.UsuarioRequest;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.repository.UsuarioRepository;
import com.aep.urbano.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public List<UsuarioResponse> listarTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public UsuarioResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Override
    @Transactional
    public UsuarioResponse criar(UsuarioRequest request) {
        if (usuarioRepository.existsByDocumento(request.documento())) {
            throw new BusinessException("Documento já cadastrado.");
        }
        Usuario usuario = Usuario.builder()
                .nome(request.nome().strip())
                .documento(request.documento().strip())
                .telefone(request.telefone())
                .email(request.email())
                .endereco(request.endereco())
                .cargo(request.cargo())
                .build();
        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioRequest request) {
        Usuario usuario = buscarEntidade(id);
        if (!usuario.getDocumento().equals(request.documento())
                && usuarioRepository.existsByDocumento(request.documento())) {
            throw new BusinessException("Documento já cadastrado para outro usuário.");
        }
        usuario.setNome(request.nome().strip());
        usuario.setDocumento(request.documento().strip());
        usuario.setTelefone(request.telefone());
        usuario.setEmail(request.email());
        usuario.setEndereco(request.endereco());
        usuario.setCargo(request.cargo());
        return toResponse(usuarioRepository.save(usuario));
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        usuarioRepository.deleteById(id);
    }

    @Override
    public Usuario buscarEntidade(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", id));
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getDocumento(),
                u.getTelefone(), u.getEmail(), u.getEndereco(), u.getCargo(), u.getCriadoEm());
    }
}
