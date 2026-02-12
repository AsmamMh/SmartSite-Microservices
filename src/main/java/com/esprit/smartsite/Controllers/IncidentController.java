package com.esprit.smartsite.Controllers;

import com.esprit.smartsite.Entites.Incident;
import com.esprit.smartsite.Services.IncidentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class IncidentController {
    
    private final IncidentService incidentService;
    
    @PostMapping
    public ResponseEntity<Incident> createIncident(@Valid @RequestBody Incident incident) {
        log.info("Requête POST pour créer un incident: {}", incident.getTitre());
        Incident createdIncident = incidentService.createIncident(incident);
        return ResponseEntity.ok(createdIncident);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getIncidentById(@PathVariable Long id) {
        log.info("Requête GET pour l'incident: {}", id);
        Optional<Incident> incident = incidentService.getIncidentById(id);
        return incident.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping
    public ResponseEntity<List<Incident>> getAllIncidents() {
        log.info("Requête GET pour tous les incidents");
        List<Incident> incidents = incidentService.getAllIncidents();
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/site/{siteId}")
    public ResponseEntity<List<Incident>> getIncidentsBySite(@PathVariable String siteId) {
        log.info("Requête GET pour les incidents du site: {}", siteId);
        List<Incident> incidents = incidentService.getIncidentsBySite(siteId);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/statut/{statut}")
    public ResponseEntity<List<Incident>> getIncidentsByStatut(@PathVariable Incident.IncidentStatut statut) {
        log.info("Requête GET pour les incidents avec statut: {}", statut);
        List<Incident> incidents = incidentService.getIncidentsByStatut(statut);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/priorite/{priorite}")
    public ResponseEntity<List<Incident>> getIncidentsByPriorite(@PathVariable Incident.IncidentPriorite priorite) {
        log.info("Requête GET pour les incidents avec priorité: {}", priorite);
        List<Incident> incidents = incidentService.getIncidentsByPriorite(priorite);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Incident>> getIncidentsByType(@PathVariable Incident.IncidentType type) {
        log.info("Requête GET pour les incidents de type: {}", type);
        List<Incident> incidents = incidentService.getIncidentsByType(type);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/declare-par/{declarePar}")
    public ResponseEntity<List<Incident>> getIncidentsByDeclarePar(@PathVariable String declarePar) {
        log.info("Requête GET pour les incidents déclarés par: {}", declarePar);
        List<Incident> incidents = incidentService.getIncidentsByDeclarePar(declarePar);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/assigne-a/{assigneA}")
    public ResponseEntity<List<Incident>> getIncidentsByAssigneA(@PathVariable String assigneA) {
        log.info("Requête GET pour les incidents assignés à: {}", assigneA);
        List<Incident> incidents = incidentService.getIncidentsByAssigneA(assigneA);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/date-range")
    public ResponseEntity<List<Incident>> getIncidentsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime debut,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        log.info("Requête GET pour les incidents entre {} et {}", debut, fin);
        List<Incident> incidents = incidentService.getIncidentsByDateRange(debut, fin);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/site/{siteId}/statut/{statut}")
    public ResponseEntity<List<Incident>> getIncidentsBySiteAndStatut(
            @PathVariable String siteId,
            @PathVariable Incident.IncidentStatut statut) {
        log.info("Requête GET pour les incidents du site {} avec statut {}", siteId, statut);
        List<Incident> incidents = incidentService.getIncidentsBySiteAndStatut(siteId, statut);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/site/{siteId}/type/{type}")
    public ResponseEntity<List<Incident>> getIncidentsBySiteAndType(
            @PathVariable String siteId,
            @PathVariable Incident.IncidentType type) {
        log.info("Requête GET pour les incidents du site {} de type {}", siteId, type);
        List<Incident> incidents = incidentService.getIncidentsBySiteAndType(siteId, type);
        return ResponseEntity.ok(incidents);
    }
    
    @GetMapping("/type/{type}/statut/{statut}")
    public ResponseEntity<List<Incident>> getIncidentsByTypeAndStatut(
            @PathVariable Incident.IncidentType type,
            @PathVariable Incident.IncidentStatut statut) {
        log.info("Requête GET pour les incidents de type {} avec statut {}", type, statut);
        List<Incident> incidents = incidentService.getIncidentsByTypeAndStatut(type, statut);
        return ResponseEntity.ok(incidents);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Incident> updateIncident(
            @PathVariable Long id,
            @Valid @RequestBody Incident incident) {
        log.info("Requête PUT pour mettre à jour l'incident: {}", id);
        try {
            Incident updatedIncident = incidentService.updateIncident(id, incident);
            return ResponseEntity.ok(updatedIncident);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la mise à jour de l'incident {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/assigner")
    public ResponseEntity<Incident> assignerIncident(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Requête PUT pour assigner l'incident: {}", id);
        try {
            String assigneA = request.get("assigneA");
            Incident updatedIncident = incidentService.assignerIncident(id, assigneA);
            return ResponseEntity.ok(updatedIncident);
        } catch (RuntimeException e) {
            log.error("Erreur lors de l'assignation de l'incident {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/statut")
    public ResponseEntity<Incident> changerStatutIncident(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Requête PUT pour changer le statut de l'incident: {}", id);
        try {
            Incident.IncidentStatut nouveauStatut = Incident.IncidentStatut.valueOf(request.get("statut"));
            Incident updatedIncident = incidentService.changerStatutIncident(id, nouveauStatut);
            return ResponseEntity.ok(updatedIncident);
        } catch (RuntimeException e) {
            log.error("Erreur lors du changement de statut de l'incident {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}/resoudre")
    public ResponseEntity<Incident> resoudreIncident(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        log.info("Requête PUT pour résoudre l'incident: {}", id);
        try {
            String resolution = request.get("resolution");
            Incident resolvedIncident = incidentService.resoudreIncident(id, resolution);
            return ResponseEntity.ok(resolvedIncident);
        } catch (RuntimeException e) {
            log.error("Erreur lors de la résolution de l'incident {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        log.info("Requête DELETE pour supprimer l'incident: {}", id);
        try {
            incidentService.deleteIncident(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            log.error("Erreur lors de la suppression de l'incident {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/statistiques/statut/{statut}")
    public ResponseEntity<Long> getNombreIncidentsByStatut(@PathVariable Incident.IncidentStatut statut) {
        log.info("Requête GET pour le nombre d'incidents avec statut: {}", statut);
        long count = incidentService.getNombreIncidentsByStatut(statut);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistiques/priorite/{priorite}")
    public ResponseEntity<Long> getNombreIncidentsByPriorite(@PathVariable Incident.IncidentPriorite priorite) {
        log.info("Requête GET pour le nombre d'incidents avec priorité: {}", priorite);
        long count = incidentService.getNombreIncidentsByPriorite(priorite);
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/statistiques/type/{type}")
    public ResponseEntity<Long> getNombreIncidentsByType(@PathVariable Incident.IncidentType type) {
        log.info("Requête GET pour le nombre d'incidents de type: {}", type);
        long count = incidentService.getNombreIncidentsByType(type);
        return ResponseEntity.ok(count);
    }
}
