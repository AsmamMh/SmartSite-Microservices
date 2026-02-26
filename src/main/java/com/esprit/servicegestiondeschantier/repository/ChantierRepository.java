package com.esprit.servicegestiondeschantier.repository;

import com.esprit.servicegestiondeschantier.entity.Chantier;
import com.esprit.servicegestiondeschantier.entity.StatutChantier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ChantierRepository extends JpaRepository<Chantier, Long> {

    List<Chantier> findByStatut(StatutChantier statut);

    List<Chantier> findByDateDebutBetween(LocalDate startDate, LocalDate endDate);

    List<Chantier> findByNomContainingIgnoreCase(String nom);
}
