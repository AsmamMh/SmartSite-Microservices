package com.esprit.smartsite.Services;

import com.esprit.smartsite.Entites.Incident;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IncidentService {
    
    Incident createIncident(Incident incident);
    
    Optional<Incident> getIncidentById(Long id);
    
    List<Incident> getAllIncidents();
    
    List<Incident> getIncidentsBySite(String siteId);
    
    List<Incident> getIncidentsByStatut(Incident.IncidentStatut statut);
    
    List<Incident> getIncidentsByPriorite(Incident.IncidentPriorite priorite);
    
    List<Incident> getIncidentsByType(Incident.IncidentType type);
    
    List<Incident> getIncidentsByDeclarePar(String declarePar);
    
    List<Incident> getIncidentsByAssigneA(String assigneA);
    
    List<Incident> getIncidentsByDateRange(LocalDateTime debut, LocalDateTime fin);
    
    List<Incident> getIncidentsBySiteAndStatut(String siteId, Incident.IncidentStatut statut);
    
    List<Incident> getIncidentsBySiteAndType(String siteId, Incident.IncidentType type);
    
    List<Incident> getIncidentsByTypeAndStatut(Incident.IncidentType type, Incident.IncidentStatut statut);
    
    Incident updateIncident(Long id, Incident incident);
    
    Incident assignerIncident(Long id, String assigneA);
    
    Incident changerStatutIncident(Long id, Incident.IncidentStatut nouveauStatut);
    
    Incident resoudreIncident(Long id, String resolution);
    
    void deleteIncident(Long id);
    
    long getNombreIncidentsByStatut(Incident.IncidentStatut statut);
    
    long getNombreIncidentsByPriorite(Incident.IncidentPriorite priorite);
    
    long getNombreIncidentsByType(Incident.IncidentType type);
}
