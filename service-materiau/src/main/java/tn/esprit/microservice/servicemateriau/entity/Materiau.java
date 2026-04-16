package tn.esprit.microservice.servicemateriau.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "materiaux")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Materiau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String localisation;  // Au lieu de "pays"

    private String unite;

    private Double quantiteStock = 0.0;

    private Double seuilAlerte = 10.0;

    private Double coutUnitaire = 0.0;

    private Boolean actif = true;

    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        dateCreation = LocalDateTime.now();
    }
}