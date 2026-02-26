package com.esprit.serviceprojet.repository;

import com.esprit.serviceprojet.entity.Projet;
import com.esprit.serviceprojet.entity.StatutProjet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjetRepository extends JpaRepository<Projet, Long> {
    
    List<Projet> findByStatut(StatutProjet statut);
    
    List<Projet> findByClientContainingIgnoreCase(String client);
    
    List<Projet> findByNomContainingIgnoreCase(String nom);
}
