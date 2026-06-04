package com.aep.urbano.service;

import com.aep.urbano.dto.request.CategoriaRequest;
import com.aep.urbano.dto.response.CategoriaResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Categoria;
import com.aep.urbano.repository.CategoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoriaService {

    private final CategoriaRepository categoriaRepository;

    public List<CategoriaResponse> listarTodas() {
        return categoriaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoriaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Transactional
    public CategoriaResponse criar(CategoriaRequest request) {
        if (categoriaRepository.existsByTipoCategoria(request.tipoCategoria())) {
            throw new BusinessException("Categoria já cadastrada: " + request.tipoCategoria());
        }
        Categoria categoria = Categoria.builder()
                .tipoCategoria(request.tipoCategoria())
                .descricao(request.descricao())
                .identificacaoPermitida(request.identificacaoPermitida())
                .build();
        return toResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public CategoriaResponse atualizar(Long id, CategoriaRequest request) {
        Categoria categoria = buscarEntidade(id);
        categoria.setDescricao(request.descricao());
        categoria.setIdentificacaoPermitida(request.identificacaoPermitida());
        return toResponse(categoriaRepository.save(categoria));
    }

    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        categoriaRepository.deleteById(id);
    }

    public Categoria buscarEntidade(Long id) {
        return categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
    }

    public CategoriaResponse toResponse(Categoria c) {
        return new CategoriaResponse(c.getId(), c.getTipoCategoria(), c.getDescricao(), c.getIdentificacaoPermitida());
    }
}
