package com.esprit.incident;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IncidentService {

    private final IncidentRepository repository;

    public IncidentService(IncidentRepository repository) {
        this.repository = repository;
    }

    public List<Incident> getAllIncidents() {
        return repository.findAll();
    }

    public Incident getIncidentById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public List<Incident> searchByTitre(String titre) {
        return repository.findByTitreContainingIgnoreCase(titre);
    }

    public Incident addIncident(Incident incident) {
        if (incident.getStatut() == null || incident.getStatut().isEmpty()) {
            incident.setStatut("DECLARE");
        }
        return repository.save(incident);
    }

    public Incident updateIncident(Integer id, Incident updated) {
        Optional<Incident> existing = repository.findById(id);
        if (existing.isPresent()) {
            Incident incident = existing.get();
            incident.setTitre(updated.getTitre());
            incident.setDescription(updated.getDescription());
            incident.setType(updated.getType());
            incident.setGravite(updated.getGravite());
            incident.setStatut(updated.getStatut());
            incident.setChantierId(updated.getChantierId());
            incident.setDeclaredBy(updated.getDeclaredBy());
            return repository.save(incident);
        }
        return null;
    }

    public boolean deleteIncident(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public Incident updateStatut(Integer id, String nouveauStatut) {
        Optional<Incident> existing = repository.findById(id);
        if (existing.isPresent()) {
            Incident incident = existing.get();
            incident.setStatut(nouveauStatut);
            return repository.save(incident);
        }
        return null;
    }
}
