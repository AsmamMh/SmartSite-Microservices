package com.smartsite.planing.Controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.service.ITaskService;

import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/task")
@CrossOrigin(origins = "*")
public class TaskController {
    private final ITaskService taskService;

    public TaskController(ITaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/{projectId}")
    public ResponseEntity<Task> createTask(@RequestBody Task task,@PathVariable Long projectId) {
        return ResponseEntity.ok(this.taskService.AddTAsk(projectId,task));
    }
    
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getAllTask(@PathVariable Long projectId) {
        return ResponseEntity.ok(this.taskService.getByProject(projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(this.taskService.getTaskById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTAsk(@PathVariable Long id){
        this.taskService.DeleteTAsk(id);
        return ResponseEntity.noContent().build();
    }


    
    
}
