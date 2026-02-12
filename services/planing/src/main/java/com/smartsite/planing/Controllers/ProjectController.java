package com.smartsite.planing.Controllers;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.Project;
import com.smartsite.planing.service.IProject;
import com.smartsite.planing.service.ProjectService;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*")
public class ProjectController {
    private final IProject projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        return ResponseEntity.ok(this.projectService.AddProject(project));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Project> putMethodName(@PathVariable Long id, @RequestBody Project entity) {
        
        return ResponseEntity.ok(this.projectService.updateProject(entity,id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        this.projectService.DeleteProject(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Project>> getMethodName() {
        return ResponseEntity.ok(this.projectService.getAll());
    }


    
}