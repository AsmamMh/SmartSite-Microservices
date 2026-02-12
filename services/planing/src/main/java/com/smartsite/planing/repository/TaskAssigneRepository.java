package com.smartsite.planing.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.TaskAssigne;
public interface TaskAssigneRepository extends JpaRepository<TaskAssigne,Long>
{
    
}
