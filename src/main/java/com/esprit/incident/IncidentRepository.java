package com.esprit.incident;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Integer> {

    // Recherche par titre (contient, insensible à la casse)
    List<Incident> findByTitreContainingIgnoreCase(String titre);
}
