package com.aep.urbano.service;

import com.aep.urbano.dto.request.DenunciaRequest;
import com.aep.urbano.dto.response.DenunciaResponse;

import java.time.LocalDate;
import java.util.List;

public interface DenunciaService {

    List<DenunciaResponse> listarTodas();

    DenunciaResponse buscarPorId(Long id);

    DenunciaResponse buscarPorProtocolo(String protocolo);

    List<DenunciaResponse> listarPorPeriodo(LocalDate inicio, LocalDate fim);

    DenunciaResponse criar(DenunciaRequest request);

    void deletar(Long id);
}
