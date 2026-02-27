package com.smartsite.notification.Conntroller;

import java.util.Date;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.notification.notification.Notification;
import com.smartsite.notification.notification.NotificationRepositorry;
import com.smartsite.notification.dto.NotificationDTO;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    private final NotificationRepositorry notificationRepository;

    public NotificationController(NotificationRepositorry notificationRepositorry){
        this.notificationRepository = notificationRepositorry;
    }
    
    @GetMapping
    public List<Notification> getMethodName() {
        return this.notificationRepository.findAll();
    }
    
    @PostMapping("/task-assignment")
    public ResponseEntity<Void> receiveTaskAssignment(@RequestBody NotificationDTO notificationDTO) {
        Notification notification = new Notification();
        notification.setTitle(notificationDTO.getTitle());
        notification.setDescription(notificationDTO.getDescription());
        notification.setReceiver(notificationDTO.getWorkerId());
        notification.setReceivedDate(new Date());
        notification.setRead(false);
        notification.setNotificationType(notificationDTO.getNotificationType() != null ? 
            notificationDTO.getNotificationType() : "TASK_ASSIGNED");
        
        notificationRepository.save(notification);
        System.out.println("Received task assignment: Task " + notificationDTO.getTaskId() + 
            " assigned to worker " + notificationDTO.getWorkerId() + 
            " for project " + notificationDTO.getProjectId());
        
        return ResponseEntity.ok().build();
    }
}
