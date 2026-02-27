package com.smartsite.planing.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.client.NotificationClient;
import com.smartsite.planing.domain.DTO.NotificationDTO;
import com.smartsite.planing.domain.entity.TaskAssigne;
import com.smartsite.planing.service.ITaskAssigne;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/taskassigne")
@CrossOrigin(origins = "*")
public class TaskAssignController {
    
    @Autowired
    private NotificationClient notificationClient;

    private final ITaskAssigne taskAssigneService;
    
    public TaskAssignController(ITaskAssigne taskAssigneService) {
        this.taskAssigneService = taskAssigneService;
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<TaskAssigne> postTaskAssign(@RequestBody TaskAssigne taskAssigne, @PathVariable Long taskId) {
        TaskAssigne taskAssigne2 = this.taskAssigneService.create(taskId, taskAssigne);
        
        // Send notification via Feign client instead of RabbitMQ
        NotificationDTO notificationDTO = new NotificationDTO();
        notificationDTO.setTaskId(taskId);
        notificationDTO.setWorkerId(taskAssigne2.getWorkerId());
        notificationDTO.setProjectId(taskAssigne2.getTask() != null && taskAssigne2.getTask().getProject() != null ? 
            taskAssigne2.getTask().getProject().getId() : null);
        notificationDTO.setTitle("Task Assignment");
        notificationDTO.setDescription("You have been assigned to task #" + taskId);
        notificationDTO.setNotificationType("TASK_ASSIGNED");
        
        notificationClient.sendTaskAssignmentNotification(notificationDTO);
        
        return ResponseEntity.ok(taskAssigne2);
    }
    
    @GetMapping("/{taskid}")
    public ResponseEntity<TaskAssigne> getTaskAssign(@PathVariable Long taskid) {
        return ResponseEntity.ok(this.taskAssigneService.getById(taskid));
    }
}
