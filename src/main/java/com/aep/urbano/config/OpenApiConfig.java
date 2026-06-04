package com.aep.urbano.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Solicitações Urbanas")
                        .description("API REST para gerenciamento de solicitações, denúncias e atendimentos urbanos. " +
                                "AEP Engenharia de Software - Segunda Entrega.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Heitor Ferrari")
                                .email("heitorferrari9@gmail.com")));
    }
}
