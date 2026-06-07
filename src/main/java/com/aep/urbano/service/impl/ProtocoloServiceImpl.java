package com.aep.urbano.service.impl;

import com.aep.urbano.service.ProtocoloService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ProtocoloServiceImpl implements ProtocoloService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private final AtomicInteger sequencial = new AtomicInteger(1);

    @Override
    public String gerarProtocoloSolicitacao() {
        return gerarProtocolo("SOL");
    }

    @Override
    public String gerarProtocoloDenuncia() {
        return gerarProtocolo("DEN");
    }

    private String gerarProtocolo(String prefixo) {
        int numero = sequencial.getAndIncrement();
        String timestamp = LocalDateTime.now().format(FORMATTER);
        return String.format("%s-%s-%04d", prefixo, timestamp, numero);
    }
}
