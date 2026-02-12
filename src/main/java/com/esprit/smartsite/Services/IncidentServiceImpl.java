package com.esprit.smartsite.Services;

import com.esprit.smartsite.Entites.Incident;
import com.esprit.smartsite.Repositories.IncidentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class IncidentServiceImpl implements IncidentService {
    
    private final IncidentRepository incidentRepository;
    
    @Override
    public Incident createIncident(Incident incident) {
        log.info("Création d'un nouvel incident: {}", incident.getTitre());
        incident.setDateDeclaration(LocalDateTime.now());
        incident.setStatut(Incident.IncidentStatut.OUVERT);
        return incidentRepository.save(incident);
    }
    
    @Override
    public Optional<Incident> getIncidentById(Long id) {
        log.debug("Recherche de l'incident avec l'ID: {}", id);
        return incidentRepository.findById(id);
    }
    
    @Override
    public List<Incident> getAllIncidents() {
        log.debug("Récupération de tous les incidents");
        return incidentRepository.findAll();
    }
    
    @Override
    public List<Incident> getIncidentsBySite(String siteId) {
        log.debug("Récupération des incidents pour le site: {}", siteId);
        return incidentRepository.findBySiteId(siteId);
    }
    
    @Override
    public List<Incident> getIncidentsByStatut(Incident.IncidentStatut statut) {
        log.debug("Récupération des incidents avec le statut: {}", statut);
        return incidentRepository.findByStatut(statut);
    }
    
    @Override
    public List<Incident> getIncidentsByPriorite(Incident.IncidentPriorite priorite) {
        log.debug("Récupération des incidents avec la priorité: {}", priorite);
        return incidentRepository.findByPriorite(priorite);
    }
    
    @Override
    public List<Incident> getIncidentsByType(Incident.IncidentType type) {
        log.debug("Récupération des incidents de type: {}", type);
        return incidentRepository.findByType(type);
    }
    
    @Override
    public List<Incident> getIncidentsByDeclarePar(String declarePar) {
        log.debug("Récupération des incidents déclarés par: {}", declarePar);
        return incidentRepository.findByDeclarePar(declarePar);
    }
    
    @Override
    public List<Incident> getIncidentsByAssigneA(String assigneA) {
        log.debug("Récupération des incidents assignés à: {}", assigneA);
        return incidentRepository.findByAssigneA(assigneA);
    }
    
    @Override
    public List<Incident> getIncidentsByDateRange(LocalDateTime debut, LocalDateTime fin) {
        log.debug("Récupération des incidents entre {} et {}", debut, fin);
        return incidentRepository.findByDateDeclarationBetween(debut, fin);
    }
    
    @Override
    public List<Incident> getIncidentsBySiteAndStatut(String siteId, Incident.IncidentStatut statut) {
        log.debug("Récupération des incidents du site {} avec statut {}", siteId, statut);
        return incidentRepository.findBySiteIdAndStatut(siteId, statut);
    }
    
    @Override
    public List<Incident> getIncidentsBySiteAndType(String siteId, Incident.IncidentType type) {
        log.debug("Récupération des incidents du site {} de type {}", siteId, type);
        return incidentRepository.findBySiteIdAndType(siteId, type);
    }
    
    @Override
    public List<Incident> getIncidentsByTypeAndStatut(Incident.IncidentType type, Incident.IncidentStatut statut) {
        log.debug("Récupération des incidents de type {} avec statut {}", type, statut);
        return incidentRepository.findByTypeAndStatut(type, statut);
    }
    
    @Override
    public Incident updateIncident(Long id, Incident incident) {
        log.info("Mise à jour de l'incident: {}", id);
        return incidentRepository.findById(id)
                .map(existingIncident -> {
                    existingIncident.setTitre(incident.getTitre());
                    existingIncident.setDescription(incident.getDescription());
                    existingIncident.setPriorite(incident.getPriorite());
                    existingIncident.setType(incident.getType());
                    existingIncident.setSiteId(incident.getSiteId());
                    return incidentRepository.save(existingIncident);
                })
                .orElseThrow(() -> new RuntimeException("Incident non trouvé avec l'ID: " + id));
    }
    
    @Override
    public Incident assignerIncident(Long id, String assigneA) {
        log.info("Assignation de l'incident {} à {}", id, assigneA);
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setAssigneA(assigneA);
                    incident.setStatut(Incident.IncidentStatut.EN_COURS);
                    return incidentRepository.save(incident);
                })
                .orElseThrow(() -> new RuntimeException("Incident non trouvé avec l'ID: " + id));
    }
    
    @Override
    public Incident changerStatutIncident(Long id, Incident.IncidentStatut nouveauStatut) {
        log.info("Changement de statut de l'incident {} à {}", id, nouveauStatut);
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatut(nouveauStatut);
                    if (nouveauStatut == Incident.IncidentStatut.RESOLU || 
                        nouveauStatut == Incident.IncidentStatut.FERME) {
                        incident.setDateResolution(LocalDateTime.now());
                    }
                    return incidentRepository.save(incident);
                })
                .orElseThrow(() -> new RuntimeException("Incident non trouvé avec l'ID: " + id));
    }
    
    @Override
    public Incident resoudreIncident(Long id, String resolution) {
        log.info("Résolution de l'incident: {}", id);
        return incidentRepository.findById(id)
                .map(incident -> {
                    incident.setStatut(Incident.IncidentStatut.RESOLU);
                    incident.setResolution(resolution);
                    incident.setDateResolution(LocalDateTime.now());
                    return incidentRepository.save(incident);
                })
                .orElseThrow(() -> new RuntimeException("Incident non trouvé avec l'ID: " + id));
    }
    
    @Override
    public void deleteIncident(Long id) {
        log.info("Suppression de l'incident: {}", id);
        if (!incidentRepository.existsById(id)) {
            throw new RuntimeException("Incident non trouvé avec l'ID: " + id);
        }
        incidentRepository.deleteById(id);
    }
    
    @Override
    public long getNombreIncidentsByStatut(Incident.IncidentStatut statut) {
        return incidentRepository.countByStatut(statut);
    }
    
    @Override
    public long getNombreIncidentsByPriorite(Incident.IncidentPriorite priorite) {
        return incidentRepository.countByPriorite(priorite);
    }
    
    @Override
    public long getNombreIncidentsByType(Incident.IncidentType type) {
        return incidentRepository.countByType(type);
    }
}
