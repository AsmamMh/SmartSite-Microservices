package tn.esprit.microservice.servicemateriau.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"consommations"})
public class Materiau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String pays;
    private String unite;
    private Double quantite;
    private Double coutUnitaire;
    private Double seuilAlerte;  // NOUVEAU : seuil minimum de stock

    @OneToMany(mappedBy = "materiau", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<MateriauConsommation> consommations = new ArrayList<>();

    // Constructeurs
    public Materiau() {}

    public Materiau(String nom, String pays, String unite, Double quantite, Double coutUnitaire, Double seuilAlerte) {
        this.nom = nom;
        this.pays = pays;
        this.unite = unite;
        this.quantite = quantite;
        this.coutUnitaire = coutUnitaire;
        this.seuilAlerte = seuilAlerte;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getPays() { return pays; }
    public void setPays(String pays) { this.pays = pays; }

    public String getUnite() { return unite; }
    public void setUnite(String unite) { this.unite = unite; }

    public Double getQuantite() { return quantite; }
    public void setQuantite(Double quantite) { this.quantite = quantite; }

    public Double getCoutUnitaire() { return coutUnitaire; }
    public void setCoutUnitaire(Double coutUnitaire) { this.coutUnitaire = coutUnitaire; }

    public Double getSeuilAlerte() { return seuilAlerte; }
    public void setSeuilAlerte(Double seuilAlerte) { this.seuilAlerte = seuilAlerte; }

    public List<MateriauConsommation> getConsommations() { return consommations; }
    public void setConsommations(List<MateriauConsommation> consommations) { this.consommations = consommations; }
}