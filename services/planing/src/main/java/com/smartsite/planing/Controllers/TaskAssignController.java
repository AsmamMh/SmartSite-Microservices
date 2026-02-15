package com.smartsite.planing.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.planing.domain.entity.Task;
import com.smartsite.planing.domain.entity.TaskAssigne;
import com.smartsite.planing.rabbitmq.RabbitMQConfig;
import com.smartsite.planing.service.ITaskAssigne;

import lombok.NoArgsConstructor;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;



@RestController
@RequestMapping("/api/taskassigne")
@CrossOrigin(origins = "*")
public class TaskAssignController {
    @Autowired
    private RabbitTemplate rabbitTemplate;

    public void sendMessage(String message) {
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "routing.key", message);
    }
    private final ITaskAssigne taskAssigneService;
    public TaskAssignController(ITaskAssigne taskAssigneService) {
        this.taskAssigneService = taskAssigneService;
    }

    @PostMapping("/{taskId}")
    public ResponseEntity<TaskAssigne> postTaskAssign(@RequestBody TaskAssigne taskAssigne,@PathVariable Long taskId) {
        TaskAssigne taskAssigne2= this.taskAssigneService.create(taskId, taskAssigne);
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, "routing.key", taskAssigne2);
        //sendMessage("Task assigned: " + taskAssigne.getWorkerId() + " to task " + taskId);
        return ResponseEntity.ok(taskAssigne2);
    }

    @GetMapping("/{taskid}")
    public ResponseEntity<TaskAssigne> getTaskAssign(@PathVariable Long taskid) {
        return ResponseEntity.ok(this.taskAssigneService.getById(taskid));
    }

    

    
}
