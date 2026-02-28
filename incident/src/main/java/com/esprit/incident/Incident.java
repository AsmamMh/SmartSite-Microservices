package com.esprit.incident;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Incident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String titre;
    private String description;

    // Accident, Sécurité, Matériel...
    private String type;

    // FAIBLE, MOYENNE, CRITIQUE
    private String gravite;

    // DECLARE, EN_COURS, RESOLU
    private String statut;

    // lien avec Construction Site MS
    private String chantierId;

    // userId du déclarant
    private String declaredBy;

    public Incident() {
    }

    public Incident(String titre,
                    String description,
                    String type,
                    String gravite,
                    String statut,
                    String chantierId,
                    String declaredBy) {
        this.titre = titre;
        this.description = description;
        this.type = type;
        this.gravite = gravite;
        this.statut = statut;
        this.chantierId = chantierId;
        this.declaredBy = declaredBy;
    }

    public Integer getId() {
        return id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getGravite() {
        return gravite;
    }

    public void setGravite(String gravite) {
        this.gravite = gravite;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getChantierId() {
        return chantierId;
    }

    public void setChantierId(String chantierId) {
        this.chantierId = chantierId;
    }

    public String getDeclaredBy() {
        return declaredBy;
    }

    public void setDeclaredBy(String declaredBy) {
        this.declaredBy = declaredBy;
    }
}
