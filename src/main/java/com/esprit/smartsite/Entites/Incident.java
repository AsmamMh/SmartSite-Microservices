package com.esprit.smartsite.Entites;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "incidents")
@EntityListeners(AuditingEntityListener.class)
public class Incident {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titre;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentPriorite priorite;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentStatut statut;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType type;
    
    @Column(nullable = false)
    private String siteId;
    
    @Column(nullable = false)
    private String declarePar;
    
    private String assigneA;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime dateDeclaration;
    
    @LastModifiedDate
    private LocalDateTime dateResolution;
    
    private String resolution;
    
    public enum IncidentPriorite {
        BASSE,
        MOYENNE,
        HAUTE,
        CRITIQUE
    }
    
    public enum IncidentStatut {
        OUVERT,
        EN_COURS,
        RESOLU,
        FERME
    }
    
    public enum IncidentType {
        SECURITE,
        ENVIRONNEMENT,
        RESSOURCES,
        PERSONNEL
    }
}
