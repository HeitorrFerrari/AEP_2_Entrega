package com.aep.urbano.service.impl;

import com.aep.urbano.dto.request.DenunciaRequest;
import com.aep.urbano.dto.response.CategoriaResponse;
import com.aep.urbano.dto.response.DenunciaResponse;
import com.aep.urbano.dto.response.UsuarioResponse;
import com.aep.urbano.exception.BusinessException;
import com.aep.urbano.exception.ResourceNotFoundException;
import com.aep.urbano.model.Categoria;
import com.aep.urbano.model.Denuncia;
import com.aep.urbano.model.Usuario;
import com.aep.urbano.model.enums.TipoIdentificacao;
import com.aep.urbano.repository.DenunciaRepository;
import com.aep.urbano.service.CategoriaService;
import com.aep.urbano.service.DenunciaService;
import com.aep.urbano.service.ProtocoloService;
import com.aep.urbano.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DenunciaServiceImpl implements DenunciaService {

    private final DenunciaRepository denunciaRepository;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;
    private final ProtocoloService protocoloService;

    @Override
    public List<DenunciaResponse> listarTodas() {
        return denunciaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public DenunciaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    @Override
    public DenunciaResponse buscarPorProtocolo(String protocolo) {
        Denuncia d = denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Denúncia com protocolo: " + protocolo));
        return toResponse(d);
    }

    @Override
    public List<DenunciaResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        LocalDateTime inicioTs = inicio.atStartOfDay();
        LocalDateTime fimTs = fim.atTime(23, 59, 59);
        return denunciaRepository.findByCriadoEmBetween(inicioTs, fimTs).stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public DenunciaResponse criar(DenunciaRequest request) {
        Categoria categoria = categoriaService.buscarEntidade(request.categoriaId());
        validarAnonimato(request);

        Usuario denunciante = null;
        if (request.denuncianteId() != null) {
            denunciante = usuarioService.buscarEntidade(request.denuncianteId());
        }

        Denuncia denuncia = Denuncia.builder()
                .protocolo(protocoloService.gerarProtocoloDenuncia())
                .categoria(categoria)
                .descricao(request.descricao().strip())
                .localizacao(request.localizacao().strip())
                .tipoIdentificacao(request.tipoIdentificacao())
                .denunciante(denunciante)
                .build();

        return toResponse(denunciaRepository.save(denuncia));
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        buscarEntidade(id);
        denunciaRepository.deleteById(id);
    }

    private void validarAnonimato(DenunciaRequest request) {
        if (request.tipoIdentificacao() == TipoIdentificacao.ANONIMO && request.denuncianteId() != null) {
            throw new BusinessException("Denúncia anônima não pode conter dados do denunciante.");
        }
        if (request.tipoIdentificacao() == TipoIdentificacao.IDENTIFICADO && request.denuncianteId() == null) {
            throw new BusinessException("Denúncia identificada exige denuncianteId.");
        }
    }

    private Denuncia buscarEntidade(Long id) {
        return denunciaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Denúncia", id));
    }

    private DenunciaResponse toResponse(Denuncia d) {
        CategoriaResponse catResp = categoriaService.toResponse(d.getCategoria());
        UsuarioResponse denuncianteResp = d.getDenunciante() == null ? null :
                new UsuarioResponse(d.getDenunciante().getId(), d.getDenunciante().getNome(),
                        d.getDenunciante().getDocumento(), d.getDenunciante().getTelefone(),
                        d.getDenunciante().getEmail(), d.getDenunciante().getEndereco(),
                        d.getDenunciante().getCargo(), d.getDenunciante().getCriadoEm());

        return new DenunciaResponse(
                d.getId(), d.getProtocolo(), catResp,
                d.getDescricao(), d.getLocalizacao(),
                d.getTipoIdentificacao(), denuncianteResp,
                d.getCriadoEm());
    }
}
