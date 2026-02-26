package com.esprit.serviceprojet.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projets")
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Column(length = 1000)
    private String description;

    @Column
    private String client;

    @Column
    private Double budget;

    @Column
    private LocalDate dateDebut;

    @Column
    private LocalDate dateFin;

    @Column
    @Enumerated(EnumType.STRING)
    private StatutProjet statut;

    // Constructeurs
    public Projet() {}

    public Projet(String nom, String description, String client, Double budget, 
                  LocalDate dateDebut, LocalDate dateFin, StatutProjet statut) {
        this.nom = nom;
        this.description = description;
        this.client = client;
        this.budget = budget;
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.statut = statut;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getClient() { return client; }
    public void setClient(String client) { this.client = client; }

    public Double getBudget() { return budget; }
    public void setBudget(Double budget) { this.budget = budget; }

    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }

    public LocalDate getDateFin() { return dateFin; }
    public void setDateFin(LocalDate dateFin) { this.dateFin = dateFin; }

    public StatutProjet getStatut() { return statut; }
    public void setStatut(StatutProjet statut) { this.statut = statut; }
}
