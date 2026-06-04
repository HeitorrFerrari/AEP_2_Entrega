package com.aep.urbano.service;

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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DenunciaService {

    private final DenunciaRepository denunciaRepository;
    private final CategoriaService categoriaService;
    private final UsuarioService usuarioService;
    private final ProtocoloService protocoloService;

    public List<DenunciaResponse> listarTodas() {
        return denunciaRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public DenunciaResponse buscarPorId(Long id) {
        return toResponse(buscarEntidade(id));
    }

    public DenunciaResponse buscarPorProtocolo(String protocolo) {
        Denuncia d = denunciaRepository.findByProtocolo(protocolo)
                .orElseThrow(() -> new ResourceNotFoundException("Denúncia com protocolo: " + protocolo));
        return toResponse(d);
    }

    public List<DenunciaResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim) {
        LocalDateTime inicioTs = inicio.atStartOfDay();
        LocalDateTime fimTs = fim.atTime(23, 59, 59);
        return denunciaRepository.findByCriadoEmBetween(inicioTs, fimTs).stream()
                .map(this::toResponse)
                .toList();
    }

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
                        d.getDenunciante().getDocumento(), d.getDenunciante().getCargo(),
                        d.getDenunciante().getCriadoEm());

        return new DenunciaResponse(
                d.getId(), d.getProtocolo(), catResp,
                d.getDescricao(), d.getLocalizacao(),
                d.getTipoIdentificacao(), denuncianteResp,
                d.getCriadoEm());
    }
}
