package com.esprit.incident;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/incidents", "/api/incidents"})
public class IncidentController {

    private final IncidentService service;

    public IncidentController(IncidentService service) {
        this.service = service;
    }

    // ✅ Afficher tous les incidents
    @GetMapping
    public List<Incident> getAll() {
        return service.getAllIncidents();
    }

    // ✅ Afficher un incident par id
    @GetMapping("/{id}")
    public ResponseEntity<Incident> getById(@PathVariable Integer id) {
        Incident incident = service.getIncidentById(id);
        if (incident == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(incident);
    }

    // ✅ Rechercher un incident par titre
    @GetMapping("/search")
    public List<Incident> searchByTitre(@RequestParam String titre) {
        return service.searchByTitre(titre);
    }

    // ✅ Ajouter un incident
    @PostMapping
    public ResponseEntity<Incident> create(@RequestBody Incident incident) {
        Incident created = service.addIncident(incident);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // ✅ Modifier un incident
    @PutMapping("/{id}")
    public ResponseEntity<Incident> update(@PathVariable Integer id, @RequestBody Incident incident) {
        Incident updated = service.updateIncident(id, incident);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    // ✅ Supprimer un incident
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        boolean deleted = service.deleteIncident(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    // ✅ Modifier le statut d’un incident (DECLARE / EN_COURS / RESOLU)
    @PatchMapping("/{id}/statut")
    public ResponseEntity<Incident> updateStatut(@PathVariable Integer id,
                                                 @RequestParam String statut) {
        Incident updated = service.updateStatut(id, statut);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }
}
