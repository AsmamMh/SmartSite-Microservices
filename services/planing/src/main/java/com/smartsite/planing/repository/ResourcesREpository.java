package com.smartsite.planing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.entity.ResourceNeed;

public interface ResourcesREpository extends JpaRepository<ResourceNeed,Long> {
    
}
