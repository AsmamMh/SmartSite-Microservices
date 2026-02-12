package com.smartsite.planing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.entity.Project;

public interface ProjectRepository extends JpaRepository<Project,Long> {
    
}
