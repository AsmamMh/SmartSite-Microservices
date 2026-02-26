package com.esprit.servicegestiondeschantier.service;

import com.esprit.servicegestiondeschantier.entity.Chantier;
import com.esprit.servicegestiondeschantier.entity.StatutChantier;
import com.esprit.servicegestiondeschantier.repository.ChantierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ChantierService {

    @Autowired
    private ChantierRepository chantierRepository;

    // Create - Créer un nouveau chantier
    public Chantier createChantier(Chantier chantier) {
        return chantierRepository.save(chantier);
    }

    // Read - Récupérer tous les chantier
    public List<Chantier> getAllChantiers() {
        return chantierRepository.findAll();
    }

    // Read - Récupérer un chantier par ID
    public Optional<Chantier> getChantierById(Long id) {
        return chantierRepository.findById(id);
    }

    // Update - Mettre à jour un chantier
    public Chantier updateChantier(Long id, Chantier chantierDetails) {
        Optional<Chantier> optionalChantier = chantierRepository.findById(id);
        
        if (optionalChantier.isPresent()) {
            Chantier chantier = optionalChantier.get();
            chantier.setNom(chantierDetails.getNom());
            chantier.setDescription(chantierDetails.getDescription());
            chantier.setAdresse(chantierDetails.getAdresse());
            chantier.setDateDebut(chantierDetails.getDateDebut());
            chantier.setDateFinPrevue(chantierDetails.getDateFinPrevue());
            chantier.setDateFinReelle(chantierDetails.getDateFinReelle());
            chantier.setBudget(chantierDetails.getBudget());
            chantier.setStatut(chantierDetails.getStatut());
            return chantierRepository.save(chantier);
        } else {
            throw new RuntimeException("Chantier non trouvé avec l'ID: " + id);
        }
    }

    // Delete - Supprimer un chantier
    public void deleteChantier(Long id) {
        if (chantierRepository.existsById(id)) {
            chantierRepository.deleteById(id);
        } else {
            throw new RuntimeException("Chantier non trouvé avec l'ID: " + id);
        }
    }

    // Rechercher par statut
    public List<Chantier> getChantiersByStatut(StatutChantier statut) {
        return chantierRepository.findByStatut(statut);
    }

    // Rechercher par nom (contains)
    public List<Chantier> searchChantiersByNom(String nom) {
        return chantierRepository.findByNomContainingIgnoreCase(nom);
    }

    // Récupérer les chantiers par période
    public List<Chantier> getChantiersByPeriode(LocalDate debut, LocalDate fin) {
        return chantierRepository.findByDateDebutBetween(debut, fin);
    }

    // Compter les chantiers
    public long countChantiers() {
        return chantierRepository.count();
    }
}
