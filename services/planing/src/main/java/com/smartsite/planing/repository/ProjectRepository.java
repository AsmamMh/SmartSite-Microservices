package com.smartsite.planing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.Project;

public interface ProjectRepository extends JpaRepository<Project,Long> {
    List<Project> findByClientId(Long clientId);
    List<Project> findByChantierId(Long chantierId);

    List<Project> findByResponsableId(Long responsableId);
}
