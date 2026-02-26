package com.smartsite.planing.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.Project;
import com.smartsite.planing.rabbitmq.RabbitMQProducer;
import com.smartsite.planing.service.IProject;
import com.smartsite.planing.service.ProjectService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/project")
@CrossOrigin(origins = "*")
public class ProjectController {
    private final IProject projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @Autowired
    private RabbitMQProducer producer;

    @GetMapping("/send")
    public String sendMessage(@RequestParam String message) {
        producer.sendMessage(message);
        return "Message sent to RabbitMQ: oooooooooooooooooooooooo" + message;
    }

    @PostMapping
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        return ResponseEntity.ok(this.projectService.AddProject(project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> putMethodName(@PathVariable Long id, @RequestBody Project entity) {

        return ResponseEntity.ok(this.projectService.updateProject(entity, id));
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

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(this.projectService.getProjectById(id));
    }

}