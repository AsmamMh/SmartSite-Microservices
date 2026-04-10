package com.smartsite.planing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.ResourceNeed;

public interface ResourcesREpository extends JpaRepository<ResourceNeed,Long> {
      List<ResourceNeed> findByTaskId(Long taskId);
       
}
