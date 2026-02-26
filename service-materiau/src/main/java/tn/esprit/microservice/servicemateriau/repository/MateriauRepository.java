package tn.esprit.microservice.servicemateriau.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import tn.esprit.microservice.servicemateriau.entity.Materiau;

public interface MateriauRepository extends JpaRepository<Materiau, Long> {
}
