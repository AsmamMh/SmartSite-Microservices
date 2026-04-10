package com.smartsite.planing.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.smartsite.planing.domain.entity.Project;
import com.smartsite.planing.repository.ProjectRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProjectService implements IProject {

    private final ProjectRepository projectRepository;

    @Override
    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    @Override
    public void DeleteProject(Long id) {
        this.projectRepository.deleteById(id);
    }
    
    @Override
    public Project updateProject(Project project, Long id) {
        Project existing = this.getProjectById(id);
        existing.setName(project.getName());
        existing.setDescription(project.getDescription());
        existing.setPlannedStart(project.getPlannedStart());
        existing.setPlannedEnd(project.getPlannedEnd());
        existing.setActualStart(project.getActualStart());
        existing.setAcctualEnd(project.getAcctualEnd());
        existing.setEstimateBudget(project.getEstimateBudget());
        existing.setActualBudget(project.getActualBudget());
        return projectRepository.save(existing);
    }

    @Override
    public Project AddProject(Project project) {
        return this.projectRepository.save(project);
    }

    @Override
    public List<Project> getAll() {
        return this.projectRepository.findAll();
    }

}
