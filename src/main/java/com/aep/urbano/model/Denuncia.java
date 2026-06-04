package com.aep.urbano.model;

import com.aep.urbano.model.enums.TipoIdentificacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "denuncias")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Denuncia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String protocolo;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_id", nullable = false)
    private Categoria categoria;

    @NotBlank
    @Column(nullable = false, length = 1000)
    private String descricao;

    @NotBlank
    @Column(nullable = false)
    private String localizacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private TipoIdentificacao tipoIdentificacao = TipoIdentificacao.ANONIMO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "denunciante_id")
    private Usuario denunciante;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @PrePersist
    void prePersist() {
        this.criadoEm = LocalDateTime.now();
    }
}
