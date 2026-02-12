package com.smartsite.planing.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.Task;

public interface TaskRepository extends JpaRepository<Task,Long> {
    
}
