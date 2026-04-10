package com.smartsite.planing.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.smartsite.planing.domain.DTO.NotificationDTO;

@FeignClient(name = "notification")
public interface NotificationClient {
    
    @PostMapping("/api/notifications/task-assignment")
    ResponseEntity<Void> sendTaskAssignmentNotification(@RequestBody NotificationDTO notificationDTO);
}
