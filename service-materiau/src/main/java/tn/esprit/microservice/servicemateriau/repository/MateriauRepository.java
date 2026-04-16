package tn.esprit.microservice.servicemateriau.repository;

import tn.esprit.microservice.servicemateriau.entity.Materiau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MateriauRepository extends JpaRepository<Materiau, Long> {

    List<Materiau> findByActifTrue();

    List<Materiau> findByLocalisation(String localisation);

    @Query("SELECT m FROM Materiau m WHERE m.quantiteStock < m.seuilAlerte")
    List<Materiau> findStockFaible();

    List<Materiau> findByNomContainingIgnoreCase(String nom);
}