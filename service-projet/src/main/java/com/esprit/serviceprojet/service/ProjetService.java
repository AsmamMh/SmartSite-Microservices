package com.esprit.serviceprojet.service;

import com.esprit.serviceprojet.entity.Projet;
import com.esprit.serviceprojet.entity.StatutProjet;
import com.esprit.serviceprojet.repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProjetService {

    @Autowired
    private ProjetRepository projetRepository;

    public Projet createProjet(Projet projet) {
        return projetRepository.save(projet);
    }

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public Optional<Projet> getProjetById(Long id) {
        return projetRepository.findById(id);
    }

    public List<Projet> getProjetsByStatut(StatutProjet statut) {
        return projetRepository.findByStatut(statut);
    }

    public List<Projet> getProjetsByClient(String client) {
        return projetRepository.findByClientContainingIgnoreCase(client);
    }

    public Projet updateProjet(Long id, Projet projetDetails) {
        Projet projet = projetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Projet not found"));
        
        projet.setNom(projetDetails.getNom());
        projet.setDescription(projetDetails.getDescription());
        projet.setClient(projetDetails.getClient());
        projet.setBudget(projetDetails.getBudget());
        projet.setDateDebut(projetDetails.getDateDebut());
        projet.setDateFin(projetDetails.getDateFin());
        projet.setStatut(projetDetails.getStatut());
        
        return projetRepository.save(projet);
    }

    public void deleteProjet(Long id) {
        projetRepository.deleteById(id);
    }

    public long countProjets() {
        return projetRepository.count();
    }
}
