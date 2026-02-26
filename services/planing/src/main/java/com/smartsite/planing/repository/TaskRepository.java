package com.smartsite.planing.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.domain.enums.TaskSTatus;


public interface TaskRepository extends JpaRepository<Task,Long> {
    List<Task> findByProjectId(Long projectId);
    List<Task> findByStatus(TaskSTatus status);
}
