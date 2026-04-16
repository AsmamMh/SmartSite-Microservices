package tn.esprit.microservice.servicemateriau.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "mouvements_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MouvementStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "materiau_id")
    private Materiau materiau;

    private String type;  // "ENTREE" ou "SORTIE"

    private Double quantite;

    private String commentaire;

    private LocalDateTime dateMouvement;

    @PrePersist
    protected void onCreate() {
        dateMouvement = LocalDateTime.now();
    }
}