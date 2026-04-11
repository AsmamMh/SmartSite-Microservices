package com.smartsite.planing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartsite.planing.domain.entity.Project;
import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.repository.ProjectRepository;
import com.smartsite.planing.repository.TaskRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TaskService implements ITaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    
    @Override
    public Task AddTAsk(Long projectId, Task task) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        task.setProject(project);
        return taskRepository.save(task);
    }

    @Override
    public Task updateTask(Task task, Long id) {
        Task existing = this.getTaskById(id);
        existing.setTitle(task.getTitle());
        existing.setDescription(task.getDescription());
        existing.setStatus(task.getStatus());
        existing.setPlannedStart(task.getPlannedStart());
        existing.setPlannedEnd(task.getPlannedEnd());
        existing.setActualStart(task.getActualStart());
        existing.setActualEnd(task.getActualEnd());
        existing.setProgress(task.getProgress());

        return taskRepository.save(existing);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public List<Task> getByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @Override
    public void DeleteTAsk(Long id) {
        this.taskRepository.deleteById(id);
    }

}
