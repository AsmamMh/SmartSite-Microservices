package com.smartsite.notification.Conntroller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartsite.notification.notification.Notification;
import com.smartsite.notification.notification.NotificationRepositorry;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
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
    public List<Notification> getMethodName(@RequestParam String param) {
        return this.notificationRepository.findAll();
    }
    
}
