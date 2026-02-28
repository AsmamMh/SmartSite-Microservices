package com.esprit.servicegestiondeschantier.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "chantiers")
public class Chantier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nom;

    @Column(length = 500)
    private String description;

    @Column(length = 200)
    private String adresse;

    @Column(name = "date_debut")
    private LocalDate dateDebut;

    @Column(name = "date_fin_prevue")
    private LocalDate dateFinPrevue;

    @Column(name = "date_fin_reelle")
    private LocalDate dateFinReelle;

    @Column(name = "budget", columnDefinition = "DECIMAL(15,2)")
    private Double budget;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private StatutChantier statut;

    public Chantier() {
    }

    public Chantier(String nom, String description, String adresse, LocalDate dateDebut, 
                    LocalDate dateFinPrevue, Double budget, StatutChantier statut) {
        this.nom = nom;
        this.description = description;
        this.adresse = adresse;
        this.dateDebut = dateDebut;
        this.dateFinPrevue = dateFinPrevue;
        this.budget = budget;
        this.statut = statut;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public LocalDate getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(LocalDate dateDebut) {
        this.dateDebut = dateDebut;
    }

    public LocalDate getDateFinPrevue() {
        return dateFinPrevue;
    }

    public void setDateFinPrevue(LocalDate dateFinPrevue) {
        this.dateFinPrevue = dateFinPrevue;
    }

    public LocalDate getDateFinReelle() {
        return dateFinReelle;
    }

    public void setDateFinReelle(LocalDate dateFinReelle) {
        this.dateFinReelle = dateFinReelle;
    }

    public Double getBudget() {
        return budget;
    }

    public void setBudget(Double budget) {
        this.budget = budget;
    }

    public StatutChantier getStatut() {
        return statut;
    }

    public void setStatut(StatutChantier statut) {
        this.statut = statut;
    }
}
