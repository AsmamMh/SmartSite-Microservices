package tn.esprit.microservice.servicemateriau.repository;

import tn.esprit.microservice.servicemateriau.entity.MateriauConsommation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MateriauConsommationRepository extends JpaRepository<MateriauConsommation, Long> {
    List<MateriauConsommation> findByMateriauIdOrderByDateConsommationAsc(Long materiauId);
    List<MateriauConsommation> findByMateriauId(Long materiauId);
}