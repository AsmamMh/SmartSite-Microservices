package com.smartsite.planing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.domain.entity.TaskAssigne;
import com.smartsite.planing.repository.TaskAssigneRepository;
import com.smartsite.planing.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskAssigneService implements ITaskAssigne {

    private final TaskAssigneRepository taskAssigneRepository;
    private final TaskRepository taskRepository;

    @Override
    public TaskAssigne create(Long taskId, TaskAssigne taskAssigne) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        taskAssigne.setTask(task);

        return taskAssigneRepository.save(taskAssigne);
    }

    @Override
    public TaskAssigne update(Long id, TaskAssigne taskAssigne) {
        TaskAssigne existing = getById(id);

        existing.setDate(taskAssigne.getDate());
        existing.setWorkerId(taskAssigne.getWorkerId());
        existing.setTeamId(taskAssigne.getTeamId());
        existing.setAssignedHOurs(taskAssigne.getAssignedHOurs());
        existing.setAssignedStatus(taskAssigne.getAssignedStatus());

        return taskAssigneRepository.save(existing);
    }

    @Override
    public TaskAssigne getById(Long id) {
        return taskAssigneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
    }

    @Override
    public List<TaskAssigne> getByTask(Long taskId) {
        return taskAssigneRepository.findByTaskId(taskId);
    }

    @Override
    public List<TaskAssigne> getByWorker(Long workerId) {
        return taskAssigneRepository.findByWorkerId(workerId);
    }

    @Override
    public List<TaskAssigne> getByTeam(Long teamId) {
        return taskAssigneRepository.findByTeamId(teamId);
    }

    @Override
    public void delete(Long id) {
        taskAssigneRepository.deleteById(id);
    }

}
