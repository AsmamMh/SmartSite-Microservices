package com.smartsite.planing.service;

import java.util.List;

import com.smartsite.planing.domain.entity.Project;

public interface IProject {
    Project getProjectById(Long id);
    void DeleteProject(Long id);
    Project updateProject(Project project,Long id);
    Project AddProject(Project project);

    List<Project> getAll();
}
