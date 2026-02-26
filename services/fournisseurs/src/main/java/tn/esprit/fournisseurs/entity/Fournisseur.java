package tn.esprit.fournisseurs.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "fournisseurs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class Fournisseur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 200)
    private String adresse;

    @Column(length = 20)
    private String telephone;

    @Column(unique = true, length = 100)
    private String email;

    private boolean actif = true;
}