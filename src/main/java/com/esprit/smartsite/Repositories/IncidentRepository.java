package com.esprit.smartsite.Repositories;

import com.esprit.smartsite.Entites.Incident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {
    
    List<Incident> findBySiteId(String siteId);
    
    List<Incident> findByStatut(Incident.IncidentStatut statut);
    
    List<Incident> findByPriorite(Incident.IncidentPriorite priorite);
    
    List<Incident> findByType(Incident.IncidentType type);
    
    List<Incident> findByDeclarePar(String declarePar);
    
    List<Incident> findByAssigneA(String assigneA);
    
    @Query("SELECT i FROM Incident i WHERE i.dateDeclaration BETWEEN :debut AND :fin")
    List<Incident> findByDateDeclarationBetween(@Param("debut") LocalDateTime debut, 
                                               @Param("fin") LocalDateTime fin);
    
    @Query("SELECT i FROM Incident i WHERE i.siteId = :siteId AND i.statut = :statut")
    List<Incident> findBySiteIdAndStatut(@Param("siteId") String siteId, 
                                        @Param("statut") Incident.IncidentStatut statut);
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.statut = :statut")
    long countByStatut(@Param("statut") Incident.IncidentStatut statut);
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.priorite = :priorite")
    long countByPriorite(@Param("priorite") Incident.IncidentPriorite priorite);
    
    @Query("SELECT COUNT(i) FROM Incident i WHERE i.type = :type")
    long countByType(@Param("type") Incident.IncidentType type);
    
    @Query("SELECT i FROM Incident i WHERE i.siteId = :siteId AND i.type = :type")
    List<Incident> findBySiteIdAndType(@Param("siteId") String siteId, 
                                       @Param("type") Incident.IncidentType type);
    
    @Query("SELECT i FROM Incident i WHERE i.type = :type AND i.statut = :statut")
    List<Incident> findByTypeAndStatut(@Param("type") Incident.IncidentType type, 
                                      @Param("statut") Incident.IncidentStatut statut);
}
