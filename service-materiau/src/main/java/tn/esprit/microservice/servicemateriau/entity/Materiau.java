package tn.esprit.microservice.servicemateriau.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

@Entity
public class Materiau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String pays;
    private String unite;
    private Double quantite;
    private Double coutUnitaire;

    public Long getId() {
        return id;
    }

    public String getNom() {
        return nom;
    }

    public String getPays() {
        return pays;
    }

    public String getUnite() {
        return unite;
    }

    public Double getQuantite() {
        return quantite;
    }

    public Double getCoutUnitaire() {
        return coutUnitaire;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public void setPays(String pays) {
        this.pays = pays;
    }

    public void setUnite(String unite) {
        this.unite = unite;
    }

    public void setQuantite(Double quantite) {
        this.quantite = quantite;
    }

    public void setCoutUnitaire(Double coutUnitaire) {
        this.coutUnitaire = coutUnitaire;
    }
}