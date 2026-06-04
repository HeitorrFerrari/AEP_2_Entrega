package com.aep.urbano.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class ProtocoloService {

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
    private final AtomicInteger sequencial = new AtomicInteger(1);

    public String gerarProtocolo(String prefixo) {
        int numero = sequencial.getAndIncrement();
        String timestamp = LocalDateTime.now().format(FORMATTER);
        return String.format("%s-%s-%04d", prefixo, timestamp, numero);
    }

    public String gerarProtocoloSolicitacao() {
        return gerarProtocolo("SOL");
    }

    public String gerarProtocoloDenuncia() {
        return gerarProtocolo("DEN");
    }
}
