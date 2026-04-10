package com.smartsite.planing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.TaskAssigne;

public interface TaskAssigneRepository extends JpaRepository<TaskAssigne, Long> {

    
    List<TaskAssigne> findByTaskId(Long taskId);

    List<TaskAssigne> findByWorkerId(Long workerId);

    List<TaskAssigne> findByTeamId(Long teamId);

}
