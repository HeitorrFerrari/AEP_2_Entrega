package com.aep.urbano.model;

import com.aep.urbano.model.enums.Prioridade;
import com.aep.urbano.model.enums.StatusSolicitacao;
import com.aep.urbano.model.enums.TipoIdentificacao;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Solicitacao {

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
    private TipoIdentificacao tipoIdentificacao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Prioridade prioridade;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cidadao_id")
    private Usuario cidadao;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusSolicitacao status = StatusSolicitacao.ABERTO;

    @Column(nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDate prazoAlvo;

    @Column(length = 500)
    private String justificativaAtraso;

    @OneToMany(mappedBy = "solicitacao", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Historico> historico = new ArrayList<>();

    @PrePersist
    void prePersist() {
        this.criadoEm = LocalDateTime.now();
        this.prazoAlvo = this.criadoEm.plusDays(this.prioridade.getSlaDias()).toLocalDate();
    }

    @Transient
    public boolean isAtrasada() {
        return LocalDate.now().isAfter(this.prazoAlvo) && !this.status.isFinal();
    }
}
