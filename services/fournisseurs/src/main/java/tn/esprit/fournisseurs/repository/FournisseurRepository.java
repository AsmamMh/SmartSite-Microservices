package tn.esprit.fournisseurs.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.fournisseurs.entity.Fournisseur;

public interface FournisseurRepository extends JpaRepository<Fournisseur, Long> {

    boolean existsByEmail(String email);
}