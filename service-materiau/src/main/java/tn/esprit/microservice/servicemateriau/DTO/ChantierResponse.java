package tn.esprit.microservice.servicemateriau.DTO;

import java.io.Serializable;

public class ChantierResponse implements Serializable {

    private Long id;
    private String nom;
    private String description;

    public ChantierResponse() {}

    public ChantierResponse(Long id, String nom, String description) {
        this.id = id;
        this.nom = nom;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getNom() { return nom; }
    public String getDescription() { return description; }

    public void setId(Long id) { this.id = id; }
    public void setNom(String nom) { this.nom = nom; }
    public void setDescription(String description) { this.description = description; }
}