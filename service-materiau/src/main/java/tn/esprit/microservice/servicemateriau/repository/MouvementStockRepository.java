package tn.esprit.microservice.servicemateriau.repository;

import tn.esprit.microservice.servicemateriau.entity.MouvementStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDateTime;
import java.util.List;

public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {

    List<MouvementStock> findByMateriauIdOrderByDateMouvementDesc(Long materiauId);

    List<MouvementStock> findByMateriauIdAndType(Long materiauId, String type);

    @Query("SELECT m FROM MouvementStock m WHERE m.materiau.id = :materiauId AND m.type = 'SORTIE' AND m.dateMouvement >= :depuis")
    List<MouvementStock> findSortiesRecentes(Long materiauId, LocalDateTime depuis);
}