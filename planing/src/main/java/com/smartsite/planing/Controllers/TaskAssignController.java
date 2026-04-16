package com.smartsite.planing.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.TaskAssigne;
import com.smartsite.planing.messaging.RabbitMQPlanningPublisher;
import com.smartsite.planing.rabbitmq.TaskAssigneEvent;
import com.smartsite.planing.service.ITaskAssigne;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/taskassigne")
public class TaskAssignController {

    private static final Logger LOGGER = LoggerFactory.getLogger(TaskAssignController.class);

    private final ITaskAssigne taskAssigneService;
    private final RabbitMQPlanningPublisher rabbitMQPlanningPublisher;
    
    public TaskAssignController(ITaskAssigne taskAssigneService, RabbitMQPlanningPublisher rabbitMQPlanningPublisher) {
        this.taskAssigneService = taskAssigneService;
        this.rabbitMQPlanningPublisher = rabbitMQPlanningPublisher;
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<TaskAssigne> postTaskAssign(@RequestBody TaskAssigne taskAssigne, @PathVariable Long taskId) {
        TaskAssigne taskAssigne2 = this.taskAssigneService.create(taskId, taskAssigne);
        
        TaskAssigneEvent event = new TaskAssigneEvent();
        event.setTaskId(taskId);
        event.setWorkerId(taskAssigne2.getWorkerId());
        event.setProjectId(taskAssigne2.getTask() != null && taskAssigne2.getTask().getProject() != null ? 
            taskAssigne2.getTask().getProject().getId() : null);
        event.setTitle("Task Assignment");
        event.setDescription("You have been assigned to task #" + taskId);
        
        try {
            rabbitMQPlanningPublisher.publishTaskAssignment(event);
            LOGGER.info("Task assignment event published for task {} and worker {}", taskId, taskAssigne2.getWorkerId());
        } catch (Exception ex) {
            LOGGER.warn("Task assigned for task {} but RabbitMQ publish failed: {}", taskId, ex.getMessage());
        }
        
        return ResponseEntity.ok(taskAssigne2);
    }
    
    @GetMapping("/{taskid}")
    public ResponseEntity<TaskAssigne> getTaskAssign(@PathVariable Long taskid) {
        return ResponseEntity.ok(this.taskAssigneService.getById(taskid));
    }
}
