package tn.esprit.microservice.servicemateriau.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
public class MateriauConsommation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double quantiteConsommee;
    private LocalDateTime dateConsommation;
    private Long chantierId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materiau_id")
    @JsonIgnore
    private Materiau materiau;

    // Constructeurs
    public MateriauConsommation() {}

    public MateriauConsommation(Double quantiteConsommee, LocalDateTime dateConsommation, Long chantierId, Materiau materiau) {
        this.quantiteConsommee = quantiteConsommee;
        this.dateConsommation = dateConsommation;
        this.chantierId = chantierId;
        this.materiau = materiau;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getQuantiteConsommee() { return quantiteConsommee; }
    public void setQuantiteConsommee(Double quantiteConsommee) { this.quantiteConsommee = quantiteConsommee; }

    public LocalDateTime getDateConsommation() { return dateConsommation; }
    public void setDateConsommation(LocalDateTime dateConsommation) { this.dateConsommation = dateConsommation; }

    public Long getChantierId() { return chantierId; }
    public void setChantierId(Long chantierId) { this.chantierId = chantierId; }

    public Materiau getMateriau() { return materiau; }
    public void setMateriau(Materiau materiau) { this.materiau = materiau; }
}